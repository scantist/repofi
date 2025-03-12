import React from "react"
import { Loader2 } from "lucide-react"

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
  text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 24, className = "", text = "加载中..." }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 
        size={size} 
        className="animate-spin text-primary mb-2"
      />
      <p className="text-sm text-gray-500">{text}</p>
    </div>
  )
}

export default LoadingSpinner