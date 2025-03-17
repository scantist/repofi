"use client"

import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "~/components/ui/popover"
import { Info } from "lucide-react"

const TradingFeePopover = ({
  assetTokenAddress
}: {
  assetTokenAddress: `0x${string}`;
}) => {
  // const { buyTax, sellTax, isLoading } = useBuySellTax(assetTokenAddress);
  const isLoading = false
  const buyTax = 3
  const sellTax = 3
  return (
    <Popover>
      <PopoverTrigger className="flex cursor-pointer items-center gap-2">
        <Info className="size-4" /> Trading Fee
      </PopoverTrigger>
      <PopoverContent className="p-4 text-sm" align="start">
        <h3 className="mb-2 text-base font-medium">Trading Fee</h3>
        <p className="text-muted-foreground text-xs">
          Following fee rates are applied to the trade:
        </p>
        <div className="text-muted-foreground grid grid-cols-2 gap-3 py-2 text-xs">
          <div className="flex gap-3">
            <div>Buy</div>
            <div className="text-foreground font-bold">
              {isLoading ? "-" : `${buyTax / 10}%`}
            </div>
          </div>
          <div className="flex gap-2">
            <div>Sell</div>
            <div className="text-foreground font-bold">
              {isLoading ? "-" : `${sellTax / 10}%`}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default TradingFeePopover
