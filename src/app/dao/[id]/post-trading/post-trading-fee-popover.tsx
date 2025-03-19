"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "~/components/ui/popover"
import { Info } from "lucide-react"

const PostTradingFeePopover = () => {
  return (
    <Popover>
      <PopoverTrigger className="flex items-center gap-2">
        <Info className="size-4" /> Trading Fee
      </PopoverTrigger>
      <PopoverContent
        className="p-4 text-sm text-muted-foreground"
        align="start"
      >
        <p>
          There is a 0.3% fee for swapping tokens. This fee is split by
          liquidity providers proportional to their contribution to
          liquidity reserves.
        </p>
        <p className="mt-4">
          <a
            href="https://docs.uniswap.org/contracts/v2/concepts/advanced-topics/fees"
            target="_blank"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Learn more about the fee structure
          </a>
        </p>
      </PopoverContent>
    </Popover>
  )
}

export default PostTradingFeePopover
