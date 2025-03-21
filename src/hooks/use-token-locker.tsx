import { useAccount, useReadContract, useSimulateContract, useWaitForTransactionReceipt, useWriteContract } from "wagmi"
import tokenLockerAbi from "~/lib/abi/TokenLocker.json"
import { defaultChain } from "~/components/auth/config"
import { useTokenLockerAddress } from "~/hooks/use-launch-contract"
import { useCallback } from "react"
import { toast } from "sonner"

type LockInfo = [
  boolean, // hasLockInfo
  boolean, // instantClaimed
  bigint, // instantAmount
  bigint, // linearClaimedAmount
  bigint, // linearClaimableAmount
  bigint, // linearRemainingAmount
  bigint // linearTotalAmount
]

/**
 * Hook to get the linear claimable amount for a specific token and user
 * @param tokenAddress The address of the token
 * @param userAddress Optional user address (defaults to connected wallet)
 */
export function useLinearClaimableAmount(tokenAddress?: `0x${string}`) {
  const { address: userAddress } = useAccount()
  const { address: tokenLockerAddress, isLoading: isTokenLockerLoading } = useTokenLockerAddress()

  const {
    data: claimableAmount,
    isLoading,
    isError,
    error,
    refetch
  } = useReadContract({
    abi: tokenLockerAbi,
    address: tokenLockerAddress,
    functionName: "getLinearClaimableAmount",
    args: [tokenAddress, userAddress],
    chainId: defaultChain.id,
    query: {
      enabled: !!tokenAddress && !!userAddress && !!tokenLockerAddress && !isTokenLockerLoading
    }
  })

  return {
    claimableAmount,
    isLoading: isLoading || isTokenLockerLoading,
    isError,
    error,
    refetch
  }
}

/**
 * Hook to get the lock information for a specific token and user
 * @param tokenAddress The address of the token
 */
export function useUserLockInfo(tokenAddress?: `0x${string}`) {
  const { address: userAddress } = useAccount()
  const { address: tokenLockerAddress, isLoading: isTokenLockerLoading } = useTokenLockerAddress()

  const {
    data: lockInfo,
    isLoading,
    isError,
    error,
    refetch
  } = useReadContract({
    abi: tokenLockerAbi,
    address: tokenLockerAddress,
    functionName: "getUserLockInfo",
    args: [tokenAddress, userAddress],
    chainId: defaultChain.id,
    query: {
      enabled: !!tokenAddress && !!userAddress && !!tokenLockerAddress && !isTokenLockerLoading
    }
  })
  const parsedLockInfo = lockInfo as LockInfo
  // Transform the raw data into a more usable structure
  const formattedLockInfo = parsedLockInfo
    ? {
        hasLockInfo: parsedLockInfo[0],
        instantClaimed: parsedLockInfo[1],
        instantAmount: parsedLockInfo[2],
        linearClaimedAmount: parsedLockInfo[3],
        linearClaimableAmount: parsedLockInfo[4],
        linearRemainingAmount: parsedLockInfo[5],
        linearTotalAmount: parsedLockInfo[6]
      }
    : undefined

  return {
    lockInfo: formattedLockInfo,
    isLoading: isLoading || isTokenLockerLoading,
    isError,
    error,
    refetch
  }
}

export function useClaim(tokenAddress: `0x${string}`) {
  const { address: userAddress } = useAccount()
  const { address: tokenLockerAddress, isLoading: isTokenLockerLoading } = useTokenLockerAddress()
  const {
    data: claimSimulation,
    isLoading: isClaimSimulating,
    isError: isClaimSimulateError,
    error: claimSimulateError
  } = useSimulateContract({
    abi: tokenLockerAbi,
    address: tokenLockerAddress,
    functionName: "claim",
    args: [tokenAddress],
    chainId: defaultChain.id,
    query: {
      enabled: !!tokenAddress && !!userAddress && !!tokenLockerAddress && !isTokenLockerLoading
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

  const startClaim = useCallback(() => {
    if (!tokenLockerAddress) {
      toast.error("Token locker contract not available")
      return
    }

    if (!userAddress) {
      toast.error("No account connected")
      return
    }

    if (!tokenAddress) {
      toast.error("No token address provided")
      return
    }

    if (claimSimulation && !isClaimSimulateError) {
      writeContract(claimSimulation.request)
    } else {
      toast.error("Unable to claim tokens", {
        description: "Simulation of contract write failed"
      })
      reset()
    }
  }, [claimSimulation, isClaimSimulateError, reset, tokenAddress, tokenLockerAddress, userAddress, writeContract])

  return {
    isClaimPending: isClaimSimulating || isTokenLockerLoading,
    isClaiming: isWritingContract || isReceiptLoading,
    isClaimError: isClaimSimulateError || isWritingContractError || isReceiptError,
    error: claimSimulateError ?? writingContractError ?? receiptError,
    claimReceipt: receipt,
    startClaim,
    resetClaim: reset
  }
}
