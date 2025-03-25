"use client"
import * as Progress from "@radix-ui/react-progress"
import { useEffect, useMemo } from "react"
import { Button } from "~/components/ui/button"
import { useTokenFullInfo } from "~/hooks/use-launch-contract"
import { useClaim, useTokenLockInfo, useUserLockInfo } from "~/hooks/use-token-locker"
import { cn, formatMoney, formatNumberWithUnit } from "~/lib/utils"
import { toHumanAmount } from "~/lib/web3"
import type { DaoDetailResult } from "~/server/service/dao"

interface DataProgressProps {
  dao: DaoDetailResult
}

export const PreProgress = ({ dao }: DataProgressProps) => {
  const { data, isLoading } = useTokenFullInfo(dao.tokenId)
  const progress = useMemo(() => {
    if (!data) {
      return 0
    }
    // 将 currentY 乘以 10000 以提高精度
    const scaledCurrentY = (data.currentY-data.curveParameter.initialY) * 10000n
    console.log("data", data)
    console.log("finalY", data.curveParameter.finalY)
    // 执行除法，然后转换为数字，再除以 10000 得到小数
    return Number(scaledCurrentY / data.curveParameter.finalY) / 100
  }, [data])
  return (
    <Progress.Root
      className="relative h-[25px] w-full overflow-hidden rounded-full bg-black border-primary border"
      style={{
        transform: "translateZ(0)"
      }}
      value={progress}
    >
      <Progress.Indicator
        className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full bg-primary transition-transform duration-[660ms] text-primary-foreground flex items-center justify-center"
        style={{ transform: `translateX(-${100 - progress}%)` }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        {isLoading ? <div>Loading...</div> : <span className="text-sm font-medium text-white">{progress}%</span>}
      </div>
    </Progress.Root>
  )
}

export const PostProgress = ({ dao }: DataProgressProps) => {
  const { tokenLockInfo, isLoading } = useTokenLockInfo(dao.tokenInfo.tokenAddress ? (dao.tokenInfo.tokenAddress as `0x${string}`) : undefined)
  const progress = useMemo(() => {
    if (!tokenLockInfo) {
      return 0
    }
    const { lockPeriod, lockStart } = tokenLockInfo
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const elapsedTime = currentTimestamp - Number(lockStart)
    const progressRatio = elapsedTime / Number(lockPeriod)
    return Math.min(Number(progressRatio), 100)
  }, [tokenLockInfo, dao])
  const { lockInfo, refetch } = useUserLockInfo(dao.tokenInfo.tokenAddress ? (dao.tokenInfo.tokenAddress as `0x${string}`) : undefined)
  const canLock = useMemo(() => {
    if (!lockInfo || !lockInfo.hasLockInfo) {
      return false
    }
    return false
  }, [lockInfo])
  const { isClaimPending, isClaiming, startClaim } = useClaim(dao.tokenInfo.tokenAddress as `0x${string}`)
  const handleClaim = () => {
    startClaim()
  }
  useEffect(() => {
    refetch()
  }, [isClaiming])
  return (
    <div className={"w-full"}>
      <div className={cn("grid grid-cols-6 mb-4", lockInfo?.instantClaimed && "grid-cols-5", !canLock && "")}>
        {!lockInfo?.instantClaimed && (
          <div className={"col-span-1 text-sm font-medium text-primary-foreground"}>
            <div>instant</div>
            <div>{formatMoney(toHumanAmount(lockInfo?.instantAmount ?? BigInt(0), 18))}</div>
          </div>
        )}
        <div className={"col-span-1 text-sm font-medium text-primary-foreground"}>
          <div>Claimed</div>
          <div>{formatMoney(toHumanAmount(lockInfo?.linearClaimedAmount ?? BigInt(0), 18))}</div>
        </div>
        <div className={"col-span-1 text-sm font-medium text-primary-foreground"}>
          <div>Claimable</div>
          <div>{formatMoney(toHumanAmount(lockInfo?.linearClaimableAmount ?? BigInt(0), 18))}</div>
        </div>
        <div className={"col-span-1 text-sm font-medium text-primary-foreground"}>
          <div>Remaining</div>
          <div>{formatMoney(toHumanAmount(lockInfo?.linearRemainingAmount ?? BigInt(0), 18))}</div>
        </div>
        <div className={"col-span-1 text-sm font-medium text-primary-foreground"}>
          <div>Total</div>
          <div>{formatMoney(toHumanAmount(lockInfo?.linearTotalAmount ?? BigInt(0), 18))}</div>
        </div>
        <Button onClick={handleClaim} disabled={isClaimPending || isClaiming}>
          Claim{(isClaimPending || isClaiming) && "ing..."}
        </Button>
      </div>
      <Progress.Root
        className="relative h-[25px] w-full overflow-hidden rounded-full bg-black border-primary border"
        style={{
          transform: "translateZ(0)"
        }}
        value={progress}
      >
        <Progress.Indicator
          className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full bg-primary transition-transform duration-[660ms] text-primary-foreground flex items-center justify-center"
          style={{ transform: `translateX(-${100 - progress}%)` }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          {isLoading ? <div>Loading...</div> : <span className="text-sm font-medium text-white">{progress.toFixed(2)}%</span>}
        </div>
      </Progress.Root>
    </div>
  )
}
