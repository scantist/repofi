import { SquareDashedMousePointer } from "lucide-react"
import type React from "react"
import { cn } from "~/lib/utils"

interface NoDataProps {
  size?: number
  className?: string
  textClassName?: string
  text?: string | React.ReactNode
}

const NoData: React.FC<NoDataProps> = ({ size = 24, className = "", textClassName = "", text = "The block no data." }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <SquareDashedMousePointer size={size} className=" text-primary mb-2" />
      <div className={cn("text-sm text-gray-500", textClassName)}>{text}</div>
    </div>
  )
}

export default NoData
