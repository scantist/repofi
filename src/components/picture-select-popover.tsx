"use client"

import { useState, type ReactNode } from "react"
import PictureSelect, { type PictureSelectProps } from "./picture-select"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"

type Props = {
  children: ReactNode
} & PictureSelectProps

export default function PictureSelectPopover({ children, onSelect, ...props }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="max-h-full w-[640px] max-w-full overflow-auto" side="right" align="center">
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
