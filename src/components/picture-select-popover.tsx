"use client"

import { type ReactNode, useState } from "react"
import PictureSelect, { type PictureSelectProps } from "./picture-select"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

type Props = {
  children: ReactNode
  side?: "top" | "right" | "bottom" | "left"
} & PictureSelectProps

export default function PictureSelectPopover({ children, side = "right", onSelect, ...props }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="max-h-full w-full md:w-[640px] max-w-full overflow-auto" side={side} align="center">
        <PictureSelect
          {...props}
          onSelect={(url) => {
            onSelect(url)
            setIsOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}
