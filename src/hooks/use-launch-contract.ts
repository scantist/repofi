import { keepPreviousData } from "@tanstack/react-query"
import { useReadContract } from "wagmi"
import { env } from "~/env"
import launchPadAbi from "~/lib/abi/LaunchPad.json"
import { useAllowance } from "~/hooks/use-token"

export function useTreasuryVaultAddress() {
  const { data: address, isLoading } = useReadContract({
    abi: launchPadAbi,
    address: env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS,
    functionName: "bondingCurve",
    query: {
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 60 * 24
    }
  })

  return {
    address: address as `0x${string}` | undefined,
    isLoading
  }
}

export function useTokenLockerAddress() {
  const { data: address, isLoading } = useReadContract({
    abi: launchPadAbi,
    address: env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS,
    functionName: "tokenLocker",
    query: {
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 60 * 24
    }
  })

  return {
    address: address as `0x${string}` | undefined,
    isLoading
  }
}
export function useBalance({
  tokenId,
  address,
  enabled = true
}: {
  tokenId: bigint;
  address: `0x${string}` | undefined;
  enabled?: boolean;
}) {
  const {
    data: balance,
    isLoading,
    refetch
  } = useReadContract({
    abi: launchPadAbi,
    address: env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS,
    functionName: "balanceOf",
    args: [tokenId, address],
    query: {
      enabled: !!tokenId && !!address && enabled,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 30 // 30 seconds
    }
  })

  return {
    data: {
      value: balance as bigint,
      decimals: 18
    },
    isLoading,
    refetch
  }
}

export function useAssetAllowance({
  amount,
  assetAddress,
  isNativeAsset
}: {
  amount: bigint;
  assetAddress: `0x${string}` | undefined;
  isNativeAsset: boolean;
}) {
  // 使用 useMemo 来返回原生代币的默认值，而不是条件调用 hooks
  const nativeTokenResult = {
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
  const nonNativeResult = useAllowance({
    amount: amount,
    tokenAddress: assetAddress,
    contractAddress: env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS
  })

  // 根据是否是原生代币返回不同的结果
  return isNativeAsset ? nativeTokenResult : nonNativeResult
}

// 添加 TokenFullInfo 类型定义
export type TokenMetadata = {
  name: string;
  symbol: string;
  creator: `0x${string}`;
  baseAsset: `0x${string}`;
  token: `0x${string}`;
  uniswapV3Pair: `0x${string}`;
};

export type CurveParameter = {
  initialX: bigint;
  initialY: bigint;
  finalX: bigint;
  finalY: bigint;
  totalSupply: bigint;
  salesRatio: number;
  reservedRatio: number;
  liquidityPoolRatio: number;
  raisedAssetAmount: bigint;
  totalSalesAmount: bigint;
};

export type TokenFullInfo = {
  launched: boolean;
  graduated: boolean;
  currentX: bigint;
  currentY: bigint;
  prevPrice: bigint;
  price: bigint;
  soldTokenAmount: bigint;
  lastUpdated: number;
  metadata: TokenMetadata;
  curveParameter: CurveParameter;
};

export function useTokenFullInfo(tokenId: bigint) {
  const { data, isLoading, refetch } = useReadContract({
    abi: launchPadAbi,
    address: env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS,
    functionName: "getTokenFullInfo",
    args: [tokenId],
    query: {
      enabled: !!tokenId,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 30 // 30 seconds
    }
  })

  return {
    data: data as TokenFullInfo | undefined,
    isLoading,
    refetch
  }
}

export function useTokenCurveParameter(tokenId: bigint) {
  const { data, isLoading, refetch } = useReadContract({
    abi: launchPadAbi,
    address: env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS,
    functionName: "getTokenCurveParameter",
    args: [tokenId],
    query: {
      enabled: !!tokenId,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 30 // 30 seconds
    }
  })

  return {
    data: data as CurveParameter | undefined,
    isLoading,
    refetch
  }
}

export function useTaxRatio() {
  const { data: buyTaxRatio, isLoading: isBuyLoading } = useReadContract({
    abi: launchPadAbi,
    address: env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS,
    functionName: "buyTaxRatio",
    query: {
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  })

  const { data: sellTaxRatio, isLoading: isSellLoading } = useReadContract({
    abi: launchPadAbi,
    address: env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS,
    functionName: "sellTaxRatio",
    query: {
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 5 // 5 minutes
    }
  })

  return {
    buyTaxRatio: buyTaxRatio as bigint,
    sellTaxRatio: sellTaxRatio as bigint,
    isLoading: isBuyLoading || isSellLoading
  }
}

export function useTokenStats(tokenId: bigint) {
  const { data: tokenInfo, isLoading: isTokenFullInfoLoading } =
    useTokenFullInfo(tokenId)
  const { buyTaxRatio, isLoading: isBuyTaxRatioLoading } = useTaxRatio()

  // 计算最大asset买入量
  const maxBuyAssetAmount = tokenInfo
    ? tokenInfo.curveParameter.finalY - tokenInfo.currentY
    : undefined
  // 计算含税的最大asset买入量
  const maxBuyAssetAmountWithTax =
    maxBuyAssetAmount && buyTaxRatio !== undefined
      ? (maxBuyAssetAmount * 10000n) / (10000n - buyTaxRatio)
      : undefined

  // 计算当前能买到的token数量
  const maxBuyTokenAmount = tokenInfo
    ? tokenInfo.currentX - tokenInfo.curveParameter.finalX
    : undefined
  const launchMarketCap = tokenInfo
    ? (tokenInfo.curveParameter.finalX * tokenInfo.curveParameter.initialY) /
      tokenInfo.curveParameter.finalY
    : undefined
  return {
    maxBuyAssetAmount,
    maxBuyAssetAmountWithTax,
    maxBuyTokenAmount,
    launchMarketCap,
    isLoading: isTokenFullInfoLoading || isBuyTaxRatioLoading
  }
}
