import { keepPreviousData } from "@tanstack/react-query"
import { useAccount, useReadContract, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import { env } from "~/env"
import launchPadAbi from "~/lib/abi/LaunchPad.json"
import { erc20Abi } from "viem"
import { useCallback } from "react"
export function useUniswapV3PoolContractAddress() {
  const { data: manager, isLoading: isManagerLoading } = useReadContract({
    abi: launchPadAbi,
    address: env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS,
    functionName: "uniswapV3PositionManager",
    query: {
      placeholderData: keepPreviousData,
      staleTime: 1000 * 60 * 60 * 24
    }
  })

  return {
    address: manager as `0x${string}` | undefined,
    isLoading: isManagerLoading
  }
}


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
  address: `0x${string}`| undefined;
  enabled?: boolean;
}) {
  const { data: balance, isLoading,refetch } = useReadContract({
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
    data:{
      value:balance as bigint,
      decimals:18
    } ,
    isLoading,
    refetch
  }
}

export function useAllowance({
                               amount,
                               tokenAddress
                             }: {
  amount: bigint;
  tokenAddress: `0x${string}` | undefined;
}) {
  const { address } = useAccount()
  const launchPadAddress=env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS
  const {
    data: allowance,
    isLoading: isAllowanceLoading,
    refetch: refetchAllowance
  } = useReadContract({
    abi: erc20Abi,
    address: tokenAddress,
    functionName: "allowance",
    args: [address!, launchPadAddress],
    query: {
      enabled: !!address && !!launchPadAddress && !!tokenAddress && amount > 0n
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
    args: [launchPadAddress, amount],
    query: {
      enabled:
        !!launchPadAddress &&
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
    reset: () => {/* 原生代币不需要重置授权 */},
    receipt: undefined
  }

  // 始终调用 useAllowance，但在原生代币的情况下传入零值
  const nonNativeResult = useAllowance({
    amount: amount,
    tokenAddress: assetAddress
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

export function useTokenFullInfo(tokenId: bigint | undefined) {
  const { data, isLoading, refetch } = useReadContract({
    abi: launchPadAbi,
    address: env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS,
    functionName: "getTokenFullInfo",
    args: tokenId ? [tokenId] : undefined,
    query: {
      enabled: !!tokenId,
      placeholderData: keepPreviousData,
      staleTime: 1000 * 30 // 30 seconds
    }
  })

  return {
    tokenInfo: data as TokenFullInfo | undefined,
    isLoading,
    refetch
  }
}
