"use client"
import * as Progress from "@radix-ui/react-progress"
import { useMemo } from "react"
import { useTokenFullInfo } from "~/hooks/use-launch-contract"
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
      >
        <span className="relative z-10 text-sm font-medium text-black">{progress}%</span>
      </Progress.Indicator>
      <div className="absolute inset-0 flex items-center justify-center">
        {isLoading ? <div>Loading...</div> : <span className="text-sm font-medium text-white">{progress}%</span>}
      </div>
    </Progress.Root>
  )
}

export const PostProgress = ({ dao }: DataProgressProps) => {
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
      >
        <span className="relative z-10 text-sm font-medium text-black">{progress}%</span>
      </Progress.Indicator>
      <div className="absolute inset-0 flex items-center justify-center">
        {isLoading ? <div>Loading...</div> : <span className="text-sm font-medium text-white">{progress}%</span>}
      </div>
    </Progress.Root>
  )
}
