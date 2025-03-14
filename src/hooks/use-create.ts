import {
  readContract,
  simulateContract,
  waitForTransactionReceipt,
  writeContract
} from "@wagmi/core"
import { useCallback, useState } from "react"
import { useAccount, useConfig } from "wagmi"
import {
  decodeEventLog,
  erc20Abi,
  formatUnits,
  getAddress,
  parseEther
} from "viem"
import { defaultChain } from "~/components/auth/config"
import { env } from "~/env"
import launchPadAbi from "~/lib/abi/LaunchPad.json"
import { api } from "~/trpc/react"
import { useAtom } from "jotai/index"
import { daoFormsAtom } from "~/store/create-dao-store"
import { type AssetToken } from "@prisma/client"
type AssetTokenWithStringPrice = Omit<AssetToken, "priceUsd"> & { priceUsd: string };

// 假设这是你的 useLaunchStepState 钩子的实现
export function useLaunchStepState() {
  const [launchStepState, setLaunchStepState] = useState({
    showSteps: false,
    now: 0,
    progress: -1,
    error: -1,
    description: undefined as string | boolean | undefined
  })
  const exitStep=useCallback(() => {
    setLaunchStepState(prevState => ({
      ...prevState,
      showSteps: false
    }))
  }, [])
  const errorStep= useCallback(() => {
    setLaunchStepState(prevState => ({
      ...prevState,
      error: prevState.now,
      progress: -1
    }))
  }, [])

  const updateDescription = useCallback((description: string | boolean) => {
    setLaunchStepState(prevState => ({
      ...prevState,
      description
    }))
  }, [])

  const initStep = useCallback(() => {
    setLaunchStepState({
      showSteps: true,
      now: 0,
      progress: 0,
      error: -1,
      description: false
    })
  }, [])

  const nextStep = useCallback(() => {
    setLaunchStepState(prevState => ({
      ...prevState,
      now: prevState.now + 1,
      progress: prevState.now + 1
    }))
  }, [])

  const finallyStep = useCallback(() => {
    setLaunchStepState(prevState => ({
      ...prevState,
      progress: -1
    }))
  }, [])

  return {
    launchStepState,
    exitStep,
    updateDescription,
    initStep,
    nextStep,
    errorStep,
    finallyStep
  }
}

export function useApprovedTransaction({
                                         onApproveMessage,
                                         onApproveError,
  targetContractAddress = env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS
}: {
  onApproveMessage: (message: string) => void
  onApproveError?: (error: unknown) => void,
  targetContractAddress?: `0x${string}`;
}) {
  const { address } = useAccount()
  const config = useConfig()
  const execute = useCallback(
    async function <T>(currentAsset?:AssetTokenWithStringPrice): Promise<T | undefined> {
      if (!address || !currentAsset) {
        onApproveError?.(
          new Error("Wallet not connected or asset not provided"),
        )
        return
      }
      const tokenAddress = currentAsset.address as `0x${string}`
      const amount = BigInt(currentAsset.launchFee.toString())
      const allowance = await readContract(config, {
        abi: erc20Abi,
        address: tokenAddress,
        chainId: defaultChain.id,
        functionName: "allowance",
        args: [address, targetContractAddress]
      })

      console.log(
        `token: ${targetContractAddress}, allowance: ${allowance} , required: ${amount} `,
      )

      if (allowance >= amount || amount === 0n) {
        return
      }
      const { request, result } = await simulateContract(config, {
        abi: erc20Abi,
        address: tokenAddress,
        functionName: "approve",
        args: [targetContractAddress, amount],
        account: address
      })

      if (!result) {
        onApproveError?.(
          new Error("Fail to approve spending cap (simulation failed)"),
        )
        return
      }

      try {
        onApproveMessage("Approval of spending cap in progress...")
        const hash = await writeContract(config, request)
        onApproveMessage("Waiting for approval transaction receipt...")
        await waitForTransactionReceipt(config, { hash })

        // If the allowance approval is successful, we call the executor recursively to ensure the allowance is indeed enough. Since user can alter the allowance to any value during the approval process.
        return execute(currentAsset)
      } catch (error) {
        onApproveError?.(
          new Error("Fail to approve spending cap", { cause: error }),
        )
        return
      }
    },
    [address, config, targetContractAddress,onApproveMessage,onApproveError],
  )
  return {
    execute
  }
}

export function useLaunchTransaction({
                                       onLaunchMessage,
                                       onLaunchError,
  targetContractAddress = env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS
}: {
  onLaunchMessage: (message: string) => void,
  onLaunchError?: (error: unknown) => void,
  targetContractAddress?: `0x${string}`;
}) {
  const totalSupply = 1000000
  const raisedAssetAmount = 500000
  const salesRatio = 5000
  const reservedRatio = 1000
  const { address } = useAccount()
  const config = useConfig()
  const [daoForms] = useAtom(daoFormsAtom)
  const execute = useCallback(
    async function (currentAsset?:AssetTokenWithStringPrice
    ): Promise<bigint | undefined> {
      if (!address || !currentAsset) {
        onLaunchError?.(
          new Error("Wallet not connected or asset not provided"),
        )
        return
      }

      let amount = 0n
      if (currentAsset.isNative) {
        amount = parseEther(
          formatUnits(
            BigInt(currentAsset.launchFee.toString()),
            currentAsset.decimals,
          ),
        )
      }

      try {
        const { request } = await simulateContract(config, {
          abi: launchPadAbi,
          address: targetContractAddress,
          functionName: "launch",
          args: [
            daoForms.name,
            daoForms.ticker,
            totalSupply,
            raisedAssetAmount,
            salesRatio,
            reservedRatio,
            currentAsset.address as `0x${string}`
          ],
          account: address,
          value: amount
        })
        onLaunchMessage("mint your token...")
        const hash = await writeContract(config, request)
        console.log("hash", hash)
        onLaunchMessage("waiting for transaction receipt...")
        const receipt = await waitForTransactionReceipt(config, {
          hash
        })
        console.log("hash", hash)

        console.log("receipt", receipt)
        console.log("receipt", receipt.logs)

        const logs = receipt.logs
        const item = logs.find(
          (log) => getAddress(log.address) === targetContractAddress,
        )

        if (!item) {
          onLaunchError?.(new Error("Failed to find launch event"))
          return
        }
        const { args } = decodeEventLog({
          ...item,
          abi: launchPadAbi
        })
        const {
          asset: eventAsset,
          tokenId: tokenId,
          initialPrice: initialPrice
        } = args as unknown as {
          asset: `0x${string}`;
          tokenId: bigint;
          initialPrice: bigint;
        }

        if (!eventAsset || !tokenId || !initialPrice) {
          onLaunchError?.(new Error("Failed to parse launch event"))
          return
        }
        return tokenId
      } catch (error) {
        onLaunchError?.(
          new Error("Launch transaction failed", { cause: error }),
        )
        return
      }
    },
    [address, daoForms, config, targetContractAddress,onLaunchMessage,onLaunchError],
  )
  return {
    execute
  }
}
export function useDataPersistence({
                                     onPersistenceMessage,
                                     onPersistenceError
                                   }: {
  onPersistenceMessage: (message: string) => void
  onPersistenceError?: (error: unknown) => void,
}) {
  const { mutateAsync: createMutate } = api.dao.create.useMutation()
  const [daoForms] = useAtom(daoFormsAtom)
  const execute = useCallback(
    async function <T>(tokenId?: bigint): Promise<T | undefined> {
      try {
        onPersistenceMessage("Persisting dao...")
        await createMutate({
          ...daoForms,
          tokenId: tokenId!
        })
        return
      } catch (error) {
        onPersistenceError?.(
          new Error("Failed to persist DAO data", { cause: error }),
        )
      }
    },
    [daoForms, createMutate,onPersistenceMessage,onPersistenceError],
  )
  return {
    execute
  }
}
