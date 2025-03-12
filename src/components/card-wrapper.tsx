"use client"

import React, { type FC, useRef, useEffect, useState } from "react"
import { cn } from "~/lib/utils"

type Props = {
  children: React.ReactNode
  className?: string
  borderClassName?: string
  contentClassName?: string
  onClick?: () => void
}

const CardWrapper: FC<Props> = ({ children, borderClassName, className, contentClassName, onClick }) => {
  const contentRef = useRef<HTMLDivElement>(null)
  const [contentHeight, setContentHeight] = useState(0)

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.clientHeight)
    }

    // 可选：使用 ResizeObserver 监听尺寸变化
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        setContentHeight(entry.contentRect.height)
      }
    })

    if (contentRef.current) {
      resizeObserver.observe(contentRef.current)
    }

    return () => {
      resizeObserver.disconnect()
    }
  }, [children]) // 当 children 改变时重新计算

  return (
    <div className={cn("relative", className)} onClick={() => onClick?.()}>
      <div
        ref={contentRef}
        className={cn("m-1 relative z-10", contentClassName)}
      >
        {children}
      </div>
      <div
        className={cn("w-full linear-border top-0 absolute p-4 border-1", borderClassName)}
        style={{ height: contentHeight ? `${contentHeight+7}px` : "auto" }}
      />
    </div>
  )
}

export default CardWrapper
