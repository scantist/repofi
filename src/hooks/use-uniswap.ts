import { keepPreviousData } from "@tanstack/react-query"
import { useCallback, useMemo } from "react"
import { toast } from "sonner"
import {
  useAccount,
  useBalance,
  useReadContract,
  useSimulateContract,
  useWaitForTransactionReceipt,
  useWriteContract
} from "wagmi"
import SwapRouter02 from "~/lib/abi/UniswapV3SwapRouter02.json"
import Pool from "~/lib/abi/UniswapV3Pool.json"
import Factory from "~/lib/abi/UniswapV3Factory.json"
import QuoterV2 from "~/lib/abi/UniswapV3QuoterV2.json"
import { defaultChain } from "~/components/auth/config"
import { env } from "~/env"
import { useAllowance } from "./use-token"

const swapRouterAddress = env.NEXT_PUBLIC_CONTRACT_SWAP_ROUTER_ADDRESS
const quoterAddress = env.NEXT_PUBLIC_CONTRACT_QUOTER_ADDRESS
const v3FactoryAddress = env.NEXT_PUBLIC_CONTRACT_V3_FACTORY_ADDRESS
const poolFee = 3000n

export function useAmountsOut({
  amountIn,
  tokenIn,
  tokenOut
}: {
  amountIn: bigint;
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
}) {
  const {
    data: simulationData,
    isLoading: isSimulationLoading,
    error: simulationError,
    isError: isSimulationError
  } = useSimulateContract({
    abi: QuoterV2,
    address: quoterAddress,
    functionName: "quoteExactInputSingle",
    args: [
      {
        tokenIn,
        tokenOut,
        fee: poolFee,
        amountIn,
        sqrtPriceLimitX96: 0n
      }
    ],
    query: {
      enabled: !!tokenIn && !!tokenOut && amountIn > 0n,
      retry: 2,
      retryDelay: 1000
    }
  })
  return {
    amountOut: simulationData?.result[0] as bigint | undefined,
    isLoading: isSimulationLoading,
    isError: isSimulationError,
    error: simulationError
  }
}

export function useAmountOutMin({
  amountIn,
  tokenIn,
  tokenOut,
  slippagePercent
}: {
  amountIn: bigint;
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  slippagePercent: number; // e.g. 0.5 for 0.5% slippage
}) {
  const { amountOut, isLoading } = useAmountsOut({
    amountIn,
    tokenIn,
    tokenOut
  })

  // 计算滑点容忍度，与V2相同
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

export function useTrade({
  tokenIn,
  tokenOut,
  amountIn,
  amountOutMin
}: {
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
  amountIn: bigint;
  amountOutMin: bigint;
}) {
  const { address } = useAccount()
  const chainId = defaultChain.id

  // 获取余额
  const {
    data: inBalance,
    isLoading: isInBalanceLoading,
    refetch: refetchInBalance
  } = useBalance({
    address: address,
    chainId: chainId,
    token: tokenIn,
    query: {
      enabled: !!address && !!tokenIn
    }
  })

  const { isLoading: isOutBalanceLoading, refetch: refetchOutBalance } =
    useBalance({
      address: address,
      chainId: chainId,
      token: tokenOut,
      query: {
        enabled: !!address && !!tokenOut
      }
    })

  const balanceOk = !!inBalance && inBalance.value >= amountIn

  const {
    checkAllowance,
    error: approveError,
    isAllowanceOk,
    isApprovePending,
    isApproving,
    isApproveError,
    hasBeenApproved,
    reset: resetApproval
  } = useAllowance({
    amount: amountIn,
    tokenAddress: tokenIn,
    contractAddress: swapRouterAddress
  })

  // V3使用不同的交易参数结构
  const exactInputParams = {
    tokenIn,
    tokenOut,
    fee: 3000, // 默认0.3%费率
    recipient: address,
    amountIn,
    amountOutMinimum: amountOutMin,
    sqrtPriceLimitX96: 0n // 不设置价格限制
  }
  const simulationEnabled =
    !!tokenIn &&
    !!tokenOut &&
    isAllowanceOk &&
    amountIn > BigInt(0) &&
    amountOutMin >= BigInt(0) &&
    balanceOk &&
    !!address &&
    !!swapRouterAddress

  console.log("Simulation enabled:", simulationEnabled, {
    hasTokenIn: !!tokenIn,
    hasTokenOut: !!tokenOut,
    isAllowanceOk,
    amountInPositive: amountIn > BigInt(0),
    amountOutMinValid: amountOutMin >= BigInt(0),
    balanceOk,
    hasAddress: !!address,
    hasRouter: !!swapRouterAddress
  })

  const {
    data: tradeSimulation,
    isLoading: isTradeSimulating,
    isError: isTradeSimulateError,
    error: tradeSimulateError
  } = useSimulateContract({
    abi: SwapRouter02,
    address: swapRouterAddress,
    functionName: "exactInputSingle",
    args: [exactInputParams],
    query: {
      enabled: simulationEnabled,
      retry: 1,
      retryDelay: 1000
    }
  })

  const {
    writeContract: tradeWriteContract,
    data: tradeWriteContractData,
    isPending: isTradeWritingContract,
    isError: isTradeWritingContractError,
    error: tradeWriteError,
    reset: resetTrading
  } = useWriteContract()

  const { data: tradeReceipt, isLoading: isTradeWaitingReceipt } =
    useWaitForTransactionReceipt({
      hash: tradeWriteContractData,
      query: {
        enabled: !!tradeWriteContractData
      }
    })

  const startTrading = useCallback(() => {
    if (!swapRouterAddress) {
      toast.error("Uniswap router not available")
      return
    }

    if (!address) {
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

    if (tradeSimulation && !isTradeSimulateError) {
      console.log("Executing trade with request:", tradeSimulation.request)
      tradeWriteContract(tradeSimulation.request)
    } else {
      const errorMessage = tradeSimulateError
        ? `Error: ${tradeSimulateError.message}`
        : "Unknown error during simulation"

      toast.error("Unable to trade", {
        description: errorMessage
      })
      resetTrading()
    }
  }, [
    checkAllowance,
    swapRouterAddress,
    address,
    balanceOk,
    tradeSimulation,
    isTradeSimulateError,
    tradeSimulateError,
    tradeWriteContract,
    resetTrading,
    exactInputParams
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
      isInBalanceLoading || isOutBalanceLoading || isTradeSimulating,
    isTrading: isTradeWritingContract || isTradeWaitingReceipt,
    isTradeError: isTradeSimulateError || isTradeWritingContractError,
    error: approveError ?? tradeSimulateError ?? tradeWriteError,

    balance: inBalance,
    isBalanceOk: balanceOk,
    isBalanceLoading: isInBalanceLoading,

    tradeReceipt,
    startTrading,
    resetTrading: reset
  }
}

export function useTokenSpotPrice(
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
  enabled = true,
  tokenADecimals = 6, // 假设 tokenA 是 USDT (6位小数)
  tokenBDecimals = 18, // 假设 tokenB 是标准ERC20 (18位小数)
) {
  // 获取池子地址
  const { data: poolAddress, isLoading: isPoolAddressLoading } =
    useReadContract({
      abi: Factory,
      address: v3FactoryAddress, // Uniswap V3 Factory
      functionName: "getPool",
      args: [tokenA, tokenB, poolFee], // 使用0.3%费率池
      query: {
        enabled: !!tokenA && !!tokenB && enabled
      }
    })
  // 获取池子当前状态
  const {
    data: slot0Data,
    isLoading: isSlot0Loading,
    refetch: refetchSlot0
  } = useReadContract({
    abi: Pool,
    address: poolAddress as `0x${string}`,
    functionName: "slot0",
    query: {
      enabled: !!poolAddress && enabled,
      placeholderData: keepPreviousData,
      refetchInterval: 1000 * 30
    }
  })

  // 计算现货价格
  const spotPrice = useMemo(() => {
    if (!slot0Data || !tokenA || !tokenB) return undefined

    // 定义 slot0 返回值的类型
    type Slot0Return = [
      bigint, // sqrtPriceX96
      number, // tick
      number, // observationIndex
      number, // observationCardinality
      number, // observationCardinalityNext
      number, // feeProtocol
      boolean, // unlocked
    ];

    // 使用正确的类型转换
    const [sqrtPriceX96] = slot0Data as Slot0Return

    if (sqrtPriceX96 === 0n) {
      return 0n
    }

    try {
      // 直接比较地址的字典序来确定哪个是token0
      // 在Uniswap V3中，较小的地址是token0
      const isTokenAToken0 = tokenA.toLowerCase() < tokenB.toLowerCase()

      // 计算原始价格 = (sqrtPriceX96 / 2^96)^2
      // 使用更精确的计算方法，避免中间结果溢出或精度损失
      const Q96 = 2n ** 96n
      // 先计算 sqrtPrice = sqrtPriceX96 / 2^96
      const sqrtPrice = (sqrtPriceX96 * 10n ** 18n) / Q96
      let rawPrice = (sqrtPrice * sqrtPrice) / 10n ** 18n

      // 调整精度 (考虑代币小数位数差异)
      const decimalAdjustment = 10n ** BigInt(tokenBDecimals - tokenADecimals)

      if (isTokenAToken0) {
        // 如果 tokenA 是 token0，价格是 token1/token0，需要取倒数
        if (rawPrice === 0n) {
          return 0n
        }
        // 使用更高精度来计算倒数，避免精度损失
        const scaleFactor = 10n ** 36n
        rawPrice = scaleFactor / rawPrice

        // 应用小数位调整
        rawPrice = rawPrice / decimalAdjustment
      } else {
        // 如果 tokenA 是 token1，价格是 token0/token1，直接使用
        rawPrice = rawPrice * decimalAdjustment
      }

      // 为了更好的可读性，计算人类可读的浮点数价格
      const humanReadablePrice = Number(rawPrice) / Number(10n ** 18n)
      console.log("Calculated price:", humanReadablePrice)

      console.log("rawPrice:", rawPrice)

      return rawPrice
    } catch (error) {
      console.error("Error calculating price:", error)
      return 0n
    }
  }, [slot0Data, tokenA, tokenB, tokenADecimals, tokenBDecimals])

  return {
    spotPrice,
    refetch: refetchSlot0,
    isLoading: isPoolAddressLoading || isSlot0Loading
  }
}
