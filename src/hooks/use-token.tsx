import { useAccount, useReadContract, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { erc20Abi } from "viem"
import { useCallback } from "react"

export function useAllowance({
  amount,
  tokenAddress,
  contractAddress
}: {
  amount: bigint
  tokenAddress: `0x${string}` | undefined
  contractAddress: `0x${string}`
}) {
  const { address } = useAccount()
  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    refetch: refetchAllowance
  } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "allowance",
    args: [address!, contractAddress],
    query: {
      enabled: !!address && !!contractAddress && !!tokenAddress && amount > 0n
    }
  })
  const allowanceOk = amount === 0n ? true : !isAllowanceLoading && !!allowance && allowance >= amount

  const {
    data: simulateResult,
    isLoading: isSimulating,
    isError: isSimulateError,
    error: simulateError
  } = useSimulateContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "approve",
    args: [contractAddress, amount],
    query: {
      enabled: !!contractAddress && !!tokenAddress && !!address && amount > BigInt(0) && !allowanceOk
    }
  })

  const { data: hash, writeContract, isPending: isWritingContract, isError: isWritingContractError, error: writingContractError, reset } = useWriteContract()

  const {
    data: receipt,
    isLoading: isReceiptLoading,
    isError: isReceiptError,
    error: receiptError
  } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash
    }
  })

  const checkAllowance = useCallback(
    () => {
      if (allowanceOk) {
        return true
      }

      if (simulateResult && !isSimulateError) {
        writeContract(simulateResult.request)
      }
      return false
    },
    [allowanceOk, simulateResult, isSimulateError, writeContract]
  )

  if (!allowanceOk && !!receipt) {
    void refetchAllowance()
  }

  const _reset = useCallback(() => {
    reset()
    void refetchAllowance()
  }, [reset, refetchAllowance])

  return {
    checkAllowance,
    reset: _reset,
    receipt,
    error: simulateError ?? writingContractError ?? receiptError,
    isAllowanceOk: allowanceOk,
    isApprovePending: isSimulating,
    isApproving: isWritingContract || isReceiptLoading,
    isApproveError: isWritingContractError || isSimulateError || isReceiptError,
    hasBeenApproved: !!receipt
  }
}
