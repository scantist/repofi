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
import ISwapRouter from "@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json"
import IUniswapV3Pool from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json"
import IUniswapV3Factory from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json"
import IQuoter from "@uniswap/v3-periphery/artifacts/contracts/interfaces/IQuoter.sol/IQuoter.json"
import { defaultChain } from "~/components/auth/config"
import { env } from "~/env"
import { useAllowance } from "./use-token"

const swapRouterAddress = env.NEXT_PUBLIC_CONTRACT_SWAP_ROUTER_ADDRESS
const quoterAddress = env.NEXT_PUBLIC_CONTRACT_QUOTER_ADDRESS
const v3FactoryAddress=env.NEXT_PUBLIC_CONTRACT_V3_FACTORY_ADDRESS
const poolFee=3000n
// 更新为使用V3的路由器合约
// 更新为使用V3的路由器合约
export function useAmountsOut({
  amountIn,
  tokenIn,
  tokenOut
}: {
  amountIn: bigint;
  tokenIn: `0x${string}`;
  tokenOut: `0x${string}`;
}) {
  // V3使用quoter合约来获取报价
  const { data: amountOut, isLoading: isAmountsOutLoading } = useReadContract({
    abi: IQuoter.abi,
    address: quoterAddress,
    functionName: "quoteExactInputSingle",
    args: [
      tokenIn,
      tokenOut,
      poolFee, // 默认使用0.3%费率，可以根据需要调整
      amountIn,
      0n // sqrtPriceLimitX96: 不设置价格限制
    ],
    query: {
      enabled: !!tokenIn && !!tokenOut && amountIn > 0n,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 30 // 30 seconds
    }
  })

  return {
    amountOut: amountOut as bigint | undefined,
    isLoading: isAmountsOutLoading
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

  const { refetch: refetchReserves } = useTokenSpotPrice(
    tokenIn,
    tokenOut,
    !!address && !!tokenIn,
  )

  const {
    data: inBalance,
    isLoading: isInBalanceLoading,
    refetch: refetchInBalance
  } = useBalance({
    address: address,
    chainId: defaultChain.id,
    token: tokenIn,
    query: {
      enabled: !!address && !!tokenIn
    }
  })

  const { isLoading: isOutBalanceLoading, refetch: refetchOutBalance } =
    useBalance({
      address: address,
      chainId: defaultChain.id,
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

  const deadline = BigInt(Math.floor(Date.now() / 1000) + 60 * 10) // 10 minutes

  // V3使用不同的交易参数结构
  const exactInputParams = {
    tokenIn,
    tokenOut,
    fee: 3000, // 默认0.3%费率
    recipient: address,
    deadline,
    amountIn,
    amountOutMinimum: amountOutMin,
    sqrtPriceLimitX96: 0n // 不设置价格限制
  }

  const {
    data: tradeSimulation,
    isLoading: isTradeSimulating,
    isError: isTradeSimulateError,
    error: tradeSimulateError
  } = useSimulateContract({
    abi: ISwapRouter.abi,
    address: swapRouterAddress,
    functionName: "exactInputSingle",
    args: [exactInputParams],
    query: {
      enabled:
        !!tokenIn &&
        !!tokenOut &&
        isAllowanceOk &&
        amountIn > BigInt(0) &&
        amountOutMin > BigInt(0) &&
        balanceOk &&
        !!address
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

    console.log("start trade", {
      trade: tradeSimulation,
      isTrading: isTradeSimulating,
      isTradingError: isTradeSimulateError
    })

    if (tradeSimulation && !isTradeSimulateError) {
      tradeWriteContract(tradeSimulation.request)
    } else {
      toast.error("Unable to trade", {
        description: "Simulation of contract write failed"
      })
      resetTrading()
    }
  }, [
    checkAllowance,
    swapRouterAddress,
    address,
    balanceOk,
    tradeSimulation,
    isTradeSimulating,
    isTradeSimulateError,
    tradeWriteContract,
    resetTrading
  ])

  const reset = useCallback(() => {
    resetTrading()
    resetApproval()
    void refetchInBalance()
    void refetchOutBalance()
    void refetchReserves()
  }, [
    resetTrading,
    resetApproval,
    refetchInBalance,
    refetchOutBalance,
    refetchReserves
  ])

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
    error: approveError ?? tradeSimulateError,

    balance: inBalance,
    isBalanceOk: balanceOk,
    isBalanceLoading: isInBalanceLoading,

    tradeReceipt,
    startTrading,
    resetTrading: reset
  }
}

// V3需要更新价格计算方法
export function useTokenSpotPrice(
  tokenA: `0x${string}`,
  tokenB: `0x${string}`,
  enabled = true,
) {
  // 获取池子地址
  const { data: poolAddress, isLoading: isPoolAddressLoading } =
    useReadContract({
      abi: IUniswapV3Factory.abi,
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
    abi: IUniswapV3Pool.abi,
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
    if (!slot0Data) return undefined
    // 定义 slot0 返回值的类型
    // Uniswap V3 Pool 的 slot0 函数返回以下结构:
    // [sqrtPriceX96, tick, observationIndex, observationCardinality, observationCardinalityNext, feeProtocol, unlocked]
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

    if (sqrtPriceX96 === 0n) return 0n

    // 计算价格 = (sqrtPriceX96 / 2^96)^2
    const price = (sqrtPriceX96 * sqrtPriceX96 * 10n ** 18n) / 2n ** 192n
    return price
  }, [slot0Data])
  return {
    spotPrice,
    refetch: refetchSlot0,
    isLoading: isPoolAddressLoading || isSlot0Loading
  }
}
