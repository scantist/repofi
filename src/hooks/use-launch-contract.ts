import { keepPreviousData } from "@tanstack/react-query"
import { useReadContract } from "wagmi"
import { env } from "~/env"
import launchPadAbi from "~/lib/abi/LaunchPad.json"
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
