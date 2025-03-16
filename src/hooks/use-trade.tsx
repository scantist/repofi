import { keepPreviousData } from "@tanstack/react-query"
import { useCallback } from "react"
import { toast } from "sonner"
import {
  useAccount,
  useBalance,
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi"
import { defaultChain } from "~/components/auth/config"
import { env } from "~/env"
import launchPadAbi from "~/lib/abi/LaunchPad.json"
import { useTreasuryVaultAddress } from "~/hooks/use-launch-contract"
import { erc20Abi } from "viem"

const launchPadAddress = env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS
/**
 * This hook is used to get the expected amount of tokens that will be received when selling a certain amount of token (inputToken) on the bonding curve.
 *
 * @param tokenAddress - The address of the AI agent token
 * @param amountIn - The amount of the input token (sending amount)
 * @param mode - The mode of the trade (buy or sell)
 * @returns
 */
export function useAmountsOut({
  tokenId,
  amountIn
}: {
  tokenId: bigint;
  amountIn: bigint;
}) {
  const { data, isLoading, ...rest } = useReadContract({
    abi: launchPadAbi,
    address: launchPadAddress,
    chainId: defaultChain.id,
    functionName: "getBuyAmountOut",
    args: [tokenId, amountIn],
    query: {
      enabled: !!launchPadAddress,
      placeholderData: keepPreviousData
    }
  })

  return {
    data: data as bigint | undefined,
    isLoading: isLoading,
    ...rest
  }
}

export function useAmountOutMin({
  tokenId,
  amountIn,
  slippagePercent
}: {
  tokenId: bigint;
  amountIn: bigint;
  slippagePercent: number;
}) {
  const { data: amountOut, isLoading } = useAmountsOut({
    tokenId,
    amountIn
  })

  const amountOutMin = amountOut
    ? (amountOut * BigInt(Math.floor((100 - slippagePercent) * 100))) /
      BigInt(10000)
    : 0n

  return {
    amountOutMin,
    amountOut,
    isLoading
  }
}

export function useAllowance({
  amount,
  tokenAddress,
  contractAddress
}: {
  amount: bigint;
  tokenAddress: `0x${string}` | undefined;
  contractAddress: `0x${string}` | undefined;
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
    args: [address!, contractAddress!],
    query: {
      enabled: !!address && !!contractAddress && !!tokenAddress && amount > 0n
    }
  })

  const allowanceOk =
    amount === 0n
      ? true
      : !isAllowanceLoading && !!allowance && allowance >= amount

  const {
    data: simulateResult,
    isLoading: isSimulating,
    isError: isSimulateError,
    error: simulateError
  } = useSimulateContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "approve",
    args: [contractAddress!, amount],
    query: {
      enabled:
        !!contractAddress &&
        !!tokenAddress &&
        !!address &&
        amount > BigInt(0) &&
        !allowanceOk
    }
  })

  const {
    data: hash,
    writeContract,
    isPending: isWritingContract,
    isError: isWritingContractError,
    error: writingContractError,
    reset
  } = useWriteContract()

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
    function () {
      if (allowanceOk) {
        return true
      }

      if (simulateResult && !isSimulateError) {
        writeContract(simulateResult.request)
      }
      return false
    },
    [allowanceOk, simulateResult, isSimulateError, writeContract],
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

function isOverLaunchPoint(message: string) {
  return message.includes("Total share is greater than sell launch point")
}

/**
 * This hook is used to trade on the bonding curve.
 *
 * @param action - The action of the trade (buy or sell)
 * @param amountIn - The amount of the input token (sending amount)
 * @param tokenAddress - The address of the AI agent token
 * @param amountOutMin - The minimum amount of the output token (receiving amount)
 * @returns
 */
export function useTrade({
  action,
  tokenIn,
  tokenOut,
  amountIn,
  amountOutMin
}: {
  action: "buy" | "sell";
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amountIn: bigint;
  amountOutMin: bigint;
}) {
  const { address: userAddress } = useAccount()

  const { address: treasuryVaultAddress, isLoading: isBondingCurveLoading } =
    useTreasuryVaultAddress()

  const {
    data: inBalance,
    isLoading: isInBalanceLoading,
    refetch: refetchInBalance
  } = useBalance({
    address: userAddress,
    chainId: defaultChain.id,
    token: tokenIn,
    query: {
      enabled: !!userAddress
    }
  })

  const { isLoading: isOutBalanceLoading, refetch: refetchOutBalance } =
    useBalance({
      address: userAddress,
      chainId: defaultChain.id,
      token: tokenOut,
      query: {
        enabled: !!userAddress && !!tokenOut
      }
    })

  const balanceOk = !!inBalance && inBalance.value >= amountIn

  const {
    error: approveError,
    checkAllowance,
    isAllowanceOk,
    isApprovePending,
    isApproving,
    isApproveError,
    hasBeenApproved,
    reset: resetApproval
  } = useAllowance({
    amount: amountIn,
    tokenAddress: tokenIn,
    contractAddress: launchPadAddress
  })

  const aiToken = action === "buy" ? tokenOut : tokenIn

  const {
    data: tradeSimulation,
    isLoading: isTradeSimulating,
    isError: isTradeSimulateError,
    error: tradeSimulateError
  } = useSimulateContract({
    abi: launchPadAbi,
    address: launchPadAddress,
    functionName: action === "buy" ? "buy" : "sell",
    args: [amountIn, aiToken, amountOutMin],
    query: {
      enabled:
        isAllowanceOk &&
        amountIn > BigInt(0) &&
        amountOutMin > BigInt(0) &&
        balanceOk &&
        !!userAddress
    }
  })

  const {
    data: buyMaxSimulation,
    isLoading: isBuyMaxSimulating,
    isError: isBuyMaxSimulateError,
    error: buyMaxSimulateError
  } = useSimulateContract({
    abi: launchPadAbi,
    address: launchPadAddress,
    functionName: "buyMax",
    args: [aiToken],
    query: {
      enabled:
        action === "buy" &&
        isAllowanceOk &&
        amountIn > BigInt(0) &&
        amountOutMin > BigInt(0) &&
        balanceOk &&
        !!userAddress
    }
  })

  const {
    writeContract: tradeWriteContract,
    data: tradeWriteContractData,
    isPending: isTradeWritingContract,
    isError: isTradeWritingContractError,
    reset: resetTrading
  } = useWriteContract()

  const { data: tradeReceipt, isLoading: isTradeWaitingReceipt } =
    useWaitForTransactionReceipt({
      hash: tradeWriteContractData,
      query: {
        enabled: !!tradeWriteContractData
      }
    })

  const shouldBuyMax =
    !!tradeSimulateError && isOverLaunchPoint(tradeSimulateError.message)

  const startTrading = useCallback(() => {
    if (!launchPadAddress) {
      toast.error("Bonding curve not available")
      return
    }

    if (!userAddress) {
      toast.error("No account connected")
      return
    }

    if (!balanceOk) {
      toast.error("Insufficient balance")
      return
    }

    if (!checkAllowance()) {
      return
    }

    if (shouldBuyMax) {
      if (buyMaxSimulation && !isBuyMaxSimulateError) {
        tradeWriteContract(buyMaxSimulation.request)
      } else {
        toast.error("Unable to trade", {
          description: "Simulation of contract write failed"
        })
        resetTrading()
      }
    } else {
      if (tradeSimulation && !isTradeSimulateError) {
        tradeWriteContract(tradeSimulation.request)
      } else {
        toast.error("Unable to trade", {
          description: "Simulation of contract write failed"
        })
        resetTrading()
      }
    }
  }, [
    balanceOk,
    launchPadAddress,
    buyMaxSimulation,
    checkAllowance,
    isBuyMaxSimulateError,
    isTradeSimulateError,
    resetTrading,
    shouldBuyMax,
    tradeSimulation,
    tradeWriteContract,
    userAddress
  ])

  const reset = useCallback(() => {
    resetTrading()
    resetApproval()
    void refetchInBalance()
    void refetchOutBalance()
  }, [resetTrading, resetApproval, refetchInBalance, refetchOutBalance])

  if (hasBeenApproved && tradeSimulation && !isTradeSimulateError) {
    startTrading()
    resetApproval()
  }

  return {
    isAllowanceOk,
    isApprovePending,
    isApproving,
    isApproveError,
    hasBeenApproved,

    isTradePending:
      isBondingCurveLoading ||
      isInBalanceLoading ||
      isOutBalanceLoading ||
      isTradeSimulating ||
      isBuyMaxSimulating,
    isTrading: isTradeWritingContract || isTradeWaitingReceipt,
    isTradeError:
      (shouldBuyMax ? isBuyMaxSimulateError : isTradeSimulateError) ||
      isTradeWritingContractError,
    error:
      approveError ?? (shouldBuyMax ? buyMaxSimulateError : tradeSimulateError),

    balance: inBalance,
    isBalanceOk: balanceOk,
    isBalanceLoading: isInBalanceLoading,

    shouldBuyMax,
    tradeReceipt,
    startTrading,
    resetTrading: reset
  }
}
