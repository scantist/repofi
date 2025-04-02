"use client"
import NumberFlow from "@number-flow/react"
import * as Progress from "@radix-ui/react-progress"
import Decimal from "decimal.js"
import { useEffect, useMemo } from "react"
import { useDaoContext } from "~/app/dao/[id]/context"
import { useAuth } from "~/components/auth/auth-context"
import ProgressStatus, { type ProgressItem } from "~/components/progress-status"
import { BoxReveal } from "~/components/ui/box-reveal"
import { Button } from "~/components/ui/button"
import { Skeleton } from "~/components/ui/skeleton"
import { TextGenerateEffect } from "~/components/ui/text-generate-effect"
import { useTokenFullInfo } from "~/hooks/use-launch-contract"
import useMediaQuery from "~/hooks/use-media-query"
import { useClaim, useTokenLockInfo, useUserLockInfo } from "~/hooks/use-token-locker"
import { cn, formatMoney } from "~/lib/utils"
import { toHumanAmount } from "~/lib/web3"

export const PreProgress = () => {
  const { detail, refresh } = useDaoContext()
  const { data, isLoading, refetch: refetchTokenFullInfo } = useTokenFullInfo(detail!.tokenId)
  const progress = useMemo(() => {
    if (!data) {
      return 0
    }
    const scaledCurrentY = (data.currentY - data.curveParameter.initialY) * 10000n
    return Number(scaledCurrentY / (data.curveParameter.finalY - data.curveParameter.initialY)) / 100
  }, [data])
  useEffect(() => {
    refetchTokenFullInfo()
  }, [refresh, refetchTokenFullInfo])
  const progressData: ProgressItem[] = useMemo(() => {
    return [
      {
        value: progress,
        color: "bg-primary animate-pulse"
      },
      {
        value: 100 - progress,
        color: "bg-primary/40"
      }
    ]
  }, [])
  return (
    <div className={"w-full flex flex-col items-center"}>
      <div>
        Launch Progress{" "}
        <NumberFlow
          value={progress}
          format={{
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          }}
        />
        %
      </div>
      {isLoading ? <Skeleton className={"w-full rounded-md h-[20px] mt-4"} /> : <ProgressStatus items={progressData} showValue={false} />}
    </div>
  )
}

export const PostProgress = () => {
  const { detail, triggerRefresh } = useDaoContext()
  const { isAuthenticated } = useAuth()
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { tokenLockInfo, isLoading } = useTokenLockInfo(detail!.tokenInfo.tokenAddress ? (detail!.tokenInfo.tokenAddress as `0x${string}`) : undefined)
  useMemo(() => {
    if (!tokenLockInfo) {
      return 0
    }
    const { lockPeriod, lockStart } = tokenLockInfo
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const elapsedTime = currentTimestamp - Number(lockStart)
    const progressRatio = (elapsedTime / Number(lockPeriod)) * 100
    return Math.min(Number(progressRatio), 100)
  }, [tokenLockInfo, detail])
  const { lockInfo, refetch } = useUserLockInfo(detail!.tokenInfo.tokenAddress ? (detail!.tokenInfo.tokenAddress as `0x${string}`) : undefined)
  const canLock = useMemo(() => {
    if (!lockInfo || !lockInfo.hasLockInfo) {
      return false
    }
    return false
  }, [lockInfo])
  const { isClaimPending, isClaiming, startClaim } = useClaim(detail!.tokenInfo.tokenAddress as `0x${string}`)
  const handleClaim = () => {
    startClaim()
  }
  useEffect(() => {
    refetch()
    triggerRefresh()
  }, [isClaiming])
  const progressData: ProgressItem[] = useMemo(() => {
    if (!lockInfo || !lockInfo?.hasLockInfo) {
      return []
    }
    const instantAmount = lockInfo.instantAmount
    const total = lockInfo.linearTotalAmount + instantAmount
    const claimed = lockInfo.linearClaimedAmount + (lockInfo.instantClaimed ? instantAmount : BigInt(0))
    const claimable = lockInfo.linearClaimableAmount + (lockInfo.instantClaimed ? BigInt(0) : instantAmount)
    const locked = total - claimed - claimable
    return [
      {
        value: Number(new Decimal(claimed.toString()).div(new Decimal(total.toString()))) * 100,
        color: "bg-purple-700",
        label: `${total === claimed ? "100%" : ""}`,
        valueString: (
          <div className={cn("flex flex-col items-center", !isDesktop && "flex-col-reverse")}>
            {isDesktop ? "claimed: " : <div>claimed</div>}
            {formatMoney(toHumanAmount(claimed, 18))}
          </div>
        ),
        showValue: total !== claimed
      },
      {
        value: Number(new Decimal(claimable.toString()).div(new Decimal(total.toString()))) * 100,
        color: "bg-green-700",
        label: "",
        valueString: (
          <div className={cn("flex flex-col items-center", !isDesktop && "flex-col-reverse")}>
            {isDesktop ? "claimable: " : <div>claimable</div>}
            {formatMoney(toHumanAmount(claimable, 18))}
          </div>
        ),
        showValue: true
      },
      {
        value: Number(new Decimal(locked.toString()).div(new Decimal(total.toString()))) * 100,
        color: "bg-amber-700",
        label: "",
        valueString: (
          <div className={cn("flex flex-col items-center", !isDesktop && "flex-col-reverse")}>
            {isDesktop ? "locked: " : <div>locked</div>}
            {formatMoney(toHumanAmount(locked, 18))}
          </div>
        ),
        showValue: true
      }
    ]
  }, [lockInfo])
  const shouldShowValue = useMemo(() => {
    if (!progressData.length) return false
    return progressData.every((item) => item.showValue)
  }, [progressData])
  const canClaimable = useMemo(() => {
    return (progressData[1]?.value ?? 0) > 0
  }, [progressData])
  return (
    <div className={"w-full flex flex-col"}>
      <div className={"text-center relative"}>
        <div className="text-md font-bold">Token Locker</div>
        <div className="text-md text-right text-muted-foreground text-sm sm:hidden">
          Total{" "}
          <span className={"text-primary font-bold"}>{formatMoney(toHumanAmount((lockInfo?.linearTotalAmount ?? BigInt(0)) + (lockInfo?.instantAmount ?? BigInt(0)), 18))}</span> $
          {detail.ticker}
        </div>
        <div className={"absolute hidden sm:block top-0 right-0 text-muted-foreground text-sm mt-1"}>
          Total{" "}
          <span className={"text-primary font-bold"}>{formatMoney(toHumanAmount((lockInfo?.linearTotalAmount ?? BigInt(0)) + (lockInfo?.instantAmount ?? BigInt(0)), 18))}</span> $
          {detail.ticker}
        </div>
      </div>
      {isLoading && <Skeleton className={"w-full rounded-md h-[20px] mt-4"} />}
      {!isLoading && isAuthenticated && (
        <>
          <ProgressStatus items={progressData} showValue={shouldShowValue} showZero={false} />
          {!shouldShowValue && (
            <TextGenerateEffect className={"mx-auto -mt-4"} duration={2} filter={false} words={"Release Completed, Your locked tokens have been successfully claimed. 🔓"} />
          )}
          {canClaimable && (
            <div className={"flex items-center justify-center w-full"}>
              <BoxReveal duration={0.5}>
                <p className="text-sm md:text-md font-bold">
                  <span>✨</span>Yeah! Now you can{" "}
                  {isClaiming ? (
                    <span className={"text-primary cursor-pointer underline-offset-2 animate-pulse"}>claiming</span>
                  ) : (
                    <span onClick={handleClaim} className={"text-primary cursor-pointer underline-offset-2 underline"}>
                      CLAIM
                    </span>
                  )}{" "}
                  this token!<span>✨</span>
                </p>
              </BoxReveal>
            </div>
          )}
        </>
      )}
    </div>
  )
}
