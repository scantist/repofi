"use client"

import jazzicon from "@metamask/jazzicon"
import React, { useEffect, useRef } from "react"

export default function WalletAvatar({
  account,
  size,
  className
}: {
  account: string
  size: number
  className?: string
}) {
  const avatarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = avatarRef.current
    if (element && account) {
      const addr = account.slice(2, 10)
      const seed = parseInt(addr, 16)
      const icon = jazzicon(size, seed)
      if (element.firstChild) {
        element.removeChild(element.firstChild)
      }
      element.appendChild(icon)
    }
  }, [account, avatarRef, size])

  return <div className={className} ref={avatarRef} />
}
