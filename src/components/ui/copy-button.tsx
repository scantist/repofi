"use client"

import { useState } from "react"
import { Button } from "./button"
import { Copy, Check, X } from "lucide-react"
import { cn } from "~/lib/utils"

export default function CopyButton({
  content,
  className
}: {
  content: string
  className?: string
}) {
  const [status, setStatus] = useState<"default" | "success" | "failed">("default")

  return (
    <Button
      size="icon"
      type="button"
      className={cn("relative size-6", className)}
      variant="ghost"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        if (status === "default") {
          navigator.clipboard
            .writeText(content)
            .then(() => {
              setStatus("success")
              setTimeout(() => {
                setStatus("default")
              }, 1500)
            })
            .catch(() => {
              setStatus("failed")
              setTimeout(() => {
                setStatus("default")
              }, 1500)
            })
        }
      }}
    >
      {status === "default" && <Copy className="absolute left-1 top-1 size-4 text-muted-foreground duration-300 animate-in fade-in zoom-in-75" />}
      {status === "success" && <Check className="absolute left-1 top-1 size-4 text-primary duration-300 animate-in fade-in zoom-in-75" />}
      {status === "failed" && <X className="absolute left-1 top-1 size-4 text-destructive duration-300 animate-in fade-in zoom-in-75" />}
    </Button>
  )
}
