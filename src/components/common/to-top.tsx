"use client"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from "~/components/ui/tooltip"

const ToTop = ({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={className}
          >
            {children}
          </button>
        </TooltipTrigger>
        <TooltipContent>To The Moon</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
export default ToTop
