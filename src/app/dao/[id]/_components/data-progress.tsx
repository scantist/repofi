"use client"
import * as Progress from "@radix-ui/react-progress"
import { useMemo } from "react"
import { useTokenFullInfo } from "~/hooks/use-launch-contract"
import { useTokenLockInfo, useUserLockInfo } from "~/hooks/use-token-locker"
import { cn } from "~/lib/utils"
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
    const scaledCurrentY = data.currentY * 10000n
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
    return Math.min(Number(progressRatio) / 100, 100)
  }, [tokenLockInfo, dao])
  const { lockInfo, isLoading: isUserLoading } = useUserLockInfo(dao.tokenInfo.tokenAddress ? (dao.tokenInfo.tokenAddress as `0x${string}`) : undefined)
  const canLock = useMemo(() => {
    if (!lockInfo || !lockInfo.hasLockInfo) {
      return false
    }
    return false
  }, [lockInfo])
  return (
    <div className={"w-full"}>
      <div className={cn("grid grid-cols-5 mb-4", !lockInfo?.instantAmount && "grid-cols-4", !canLock && "hidden")}>
        {lockInfo?.instantAmount && (
          <div className={"col-span-1 text-sm font-medium text-primary-foreground"}>
            <div>instant</div>
            <div>{lockInfo?.instantAmount}</div>
          </div>
        )}
        <div className={"col-span-1 text-sm font-medium text-primary-foreground"}>
          <div>Claimed</div>
          <div>{lockInfo?.linearClaimedAmount ?? 0}</div>
        </div>
        <div className={"col-span-1 text-sm font-medium text-primary-foreground"}>
          <div>Claimable</div>
          <div>{lockInfo?.linearClaimableAmount ?? 0}</div>
        </div>
        <div className={"col-span-1 text-sm font-medium text-primary-foreground"}>
          <div>Remaining</div>
          <div>{lockInfo?.linearRemainingAmount ?? 0}</div>
        </div>
        <div className={"col-span-1 text-sm font-medium text-primary-foreground"}>
          <div>Total</div>
          <div>{lockInfo?.linearTotalAmount ?? 0}</div>
        </div>
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
