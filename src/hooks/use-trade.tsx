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
import {
  useBalance as useLaunchBalance
} from "~/hooks/use-launch-contract"
import { useAllowance as useTokenAllowance } from "~/hooks/use-token"

const launchPadAddress = env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS

/**
 * This hook is used to get the expected amount of tokens that will be received when selling a certain amount of token (inputToken) on the bonding curve.
 *
 * @param action - The mode of the trade (buy or sell)
 * @param tokenAddress - The address of the AI agent token
 * @param amountIn - The amount of the input token (sending amount)
 * @param mode - The mode of the trade (buy or sell)
 * @returns
 */
export function useAmountOut({
  action,
  tokenId,
  amountIn
}: {
  action: "buy" | "sell";
  tokenId: bigint;
  amountIn: bigint;
}) {
  const { data, isLoading, ...rest } = useReadContract({
    abi: launchPadAbi,
    address: launchPadAddress,
    chainId: defaultChain.id,
    functionName: action === "buy" ? "getBuyAmountOut" : "getSellAmountOut",
    args: [tokenId, amountIn],
    query: {
      enabled: !!launchPadAddress,
      placeholderData: keepPreviousData,
      retry: false
    }
  })
  return {
    data: data as bigint | undefined,
    isLoading: isLoading,
    ...rest
  }
}

export function useAmountOutMin({
  action,
  tokenId,
  amountIn,
  slippagePercent
}: {
  action: "buy" | "sell";
  tokenId: bigint;
  amountIn: bigint;
  slippagePercent: number;
}) {
  const { data: amountOut, isLoading, ...rest } = useAmountOut({
    action,
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
    isLoading,
    ...rest
  }
}

function isOverLaunchPoint(message: string) {
  return message.includes("amountIn is too large")
}

export function useAllowance({
          action,
                                    amount,
                                    assetAddress,
                                    isNativeAsset
                                  }: {
  action: "buy" | "sell";
  amount: bigint;
  assetAddress: `0x${string}` | undefined;
  isNativeAsset: boolean;
}) {
  // 使用 useMemo 来返回默认值，而不是条件调用 hooks
  const noneResult = {
    error: undefined,
    checkAllowance: () => true,
    isAllowanceOk: true,
    isApprovePending: false,
    isApproving: false,
    isApproveError: false,
    hasBeenApproved: false,
    reset: () => {
      /* 原生代币不需要重置授权 */
    },
    receipt: undefined
  }

  // 始终调用 useAllowance，但在原生代币的情况下传入零值
  const nonNativeResult = useTokenAllowance({
    amount: amount,
    tokenAddress: assetAddress,
    contractAddress: env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS
  })

  // 根据是否是原生代币返回不同的结果
  return isNativeAsset||action=="sell" ? noneResult : nonNativeResult
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
  tokenId,
  assetAddress,
  isNativeAsset,
  amountIn,
  amountOutMin
}: {
  action: "buy" | "sell";
  tokenId: bigint;
  assetAddress: `0x${string}`;
  isNativeAsset: boolean;
  amountIn: bigint;
  amountOutMin: bigint;
}) {
  const { address: userAddress } = useAccount()
  const {
    data: inBalance,
    isLoading: isInBalanceLoading,
    refetch: refetchInBalance
  } = useBalance({
    address: userAddress,
    chainId: defaultChain.id,
    ...(isNativeAsset ? {} : { token: assetAddress }),
    query: {
      enabled: !!userAddress
    }
  })

  const { data: outBalance, isLoading: isOutBalanceLoading, refetch: refetchOutBalance } =
    useLaunchBalance({
      address: userAddress,
      tokenId: tokenId,
      enabled: !!userAddress && !!tokenId
    })

  const balanceOk = (!!inBalance && inBalance.value >= amountIn)||
    (!!outBalance && outBalance.value >= amountIn)

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
    action,
    amount: amountIn,
    assetAddress,
    isNativeAsset
  })

  const {
    data: tradeSimulation,
    isLoading: isTradeSimulating,
    isError: isTradeSimulateError,
    error: tradeSimulateError
  } = useSimulateContract({
    abi: launchPadAbi,
    address: launchPadAddress,
    functionName: action === "buy" ? "buy" : "sell",
    args: [tokenId, amountIn, amountOutMin],
    query: {
      enabled:
        isAllowanceOk &&
        amountIn > BigInt(0) &&
        amountOutMin >= BigInt(0) &&
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
    args: [tokenId],
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
      toast.error("Launch pad not available")
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
          description: "Simulation of contract write failed 1"
        })
        resetTrading()
      }
    } else {
      if (tradeSimulation && !isTradeSimulateError) {
        tradeWriteContract(tradeSimulation.request)
      } else {
        toast.error("Unable to trade", {
          description: "Simulation of contract write failed 2"
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

    balance: action=="buy" ? inBalance : outBalance,
    isBalanceOk: balanceOk,
    isBalanceLoading: isInBalanceLoading||isOutBalanceLoading,
    shouldBuyMax,
    tradeReceipt,
    startTrading,
    resetTrading: reset
  }
}
