import { Loader2 } from "lucide-react"
import type React from "react"
import { cn } from "~/lib/utils"

interface LoadingSpinnerProps {
  size?: number
  className?: string
  text?: string
  textClassName?: string
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, className = "", text = "Loading...", textClassName = "" }) => {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 size={size} className="animate-spin text-primary mb-2" />
      <div className={cn("text-sm text-gray-500", textClassName)}>{text}</div>
    </div>
  )
}

export default LoadingSpinner
