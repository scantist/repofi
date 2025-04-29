import { ethAddress, getAddress } from "viem"
import { useAccount, useBalance } from "wagmi"
import { defaultChain } from "~/lib/web3"
import { api } from "~/trpc/react"

export function useAssetTokenList() {
  return api.assetToken.getAssetTokens.useQuery(undefined, {
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 60 * 60 * 1000 // 1 hour
  })
}

export function useAssetTokenInfo(address: string) {
  const { data, isError, error, ...rest } = useAssetTokenList()
  console.log("assetTokenList", data)
  const assetToken = data?.find((token) => getAddress(token.address) === getAddress(address))

  const notFound = data !== undefined && assetToken === undefined

  return {
    data: assetToken,
    allData: data,
    isError: isError || notFound,
    error: notFound ? new Error("Asset token not found") : error,
    ...rest
  }
}

export function useAssetTokenBalance(assetAddress: `0x${string}`) {
  const { address: userAddress } = useAccount()
  const isNativeAsset = assetAddress === ethAddress
  const {
    data: balance,
    isLoading: isBalanceLoading,
    refetch: refetchBalance
  } = useBalance({
    address: userAddress,
    chainId: defaultChain.id,
    ...(isNativeAsset ? {} : { token: assetAddress }),
    query: {
      enabled: !!userAddress
    }
  })

  return {
    balance,
    isBalanceLoading,
    refetchBalance
  }
}