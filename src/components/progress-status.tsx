import type React from "react"
import { cn } from "~/lib/utils"

export interface ProgressItem {
  label?: string | React.ReactNode
  value: number
  valueString?: string | React.ReactNode
  color: string
  stretch?: boolean
  showValue?: boolean
}

export function ProgressBlock({ label, value, valueString, color, total = 100, stretch, showValue, showZero }: ProgressItem & { total?: number; showZero?: boolean }) {
  if (!showZero && value === 0) {
    return null
  }
  console.log("showValue && item.showValue", showValue)
  return (
    <div
      className={cn("relative h-full transition-all", color, {
        "flex-1 text-gray-500": stretch
      })}
      style={{ width: `${(value / total) * 100}%` }}
    >
      {showValue && (
        <>
          <div className={cn("absolute top-full mt-1 left-1/2 size-4 translate-y-1 -translate-x-1/2 rotate-45", color)} />
          <div className={cn("absolute top-full rounded-sm mt-1 left-1/2 flex -translate-x-1/2 translate-y-3 flex-col justify-center ", color)}>
            <div className="relative px-3 py-1 text-xs font-bold whitespace-nowrap">{valueString ? valueString : `${value}%`}</div>
          </div>
        </>
      )}
      <div className="flex h-full w-full overflow-hidden min-h-[20px] items-center justify-center text-xs py-1 font-bold">{label}</div>
    </div>
  )
}

export default function ProgressStatus({
  items,
  total = 100,
  showValue = true,
  showZero = true
}: { items: ProgressItem[]; total?: number; showValue?: boolean; showZero?: boolean }) {
  return (
    <div className={cn("flex w-full flex-row my-4", showValue ? "pb-12 md:pb-12" : "rounded-md overflow-hidden")}>
      {items?.map((item, index) => (
        <ProgressBlock key={`ProgressStatus-${item.label}-${index}`} {...item} total={total} showValue={showValue && item.showValue} showZero={showZero} />
      ))}
    </div>
  )
}
