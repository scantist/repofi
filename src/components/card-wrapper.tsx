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
  return (
    <div className={cn("p-[1px] relative", className)}>
      <div className={cn("absolute inset-0 bg-gradient-to-b from-[#F8D3537F] to-[#6E6DF07F] rounded-lg", borderClassName)} />
      <div className={cn("bg-card rounded-lg  relative group", contentClassName)}>{children}</div>
    </div>
  )
}

export default CardWrapper
