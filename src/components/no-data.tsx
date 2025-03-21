import React from "react"
import { FileX2 } from "lucide-react"
import { cn } from "~/lib/utils"

interface NoDataProps {
  size?: number
  className?: string
  textClassName?: string
  text?: string
}

const NoData: React.FC<NoDataProps> = ({ size = 24, className = "", textClassName = "", text = "The block no data." }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <FileX2 size={size} className=" text-primary mb-2" />
      <p className={cn("text-sm text-gray-500", textClassName)}>{text}</p>
    </div>
  )
}

export default NoData
