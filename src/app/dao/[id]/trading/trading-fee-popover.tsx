"use client"

import { Popover, PopoverContent, PopoverTrigger } from "~/components/ui/popover"
import { Info } from "lucide-react"
import { useTaxRatio } from "~/hooks/use-launch-contract"

const TradingFeePopover = () => {
  const { buyTaxRatio, sellTaxRatio, isLoading } = useTaxRatio()
  console.log("useTaxRatio", buyTaxRatio, sellTaxRatio)
  return (
    <Popover>
      <PopoverTrigger className="flex cursor-pointer items-center gap-2">
        <Info className="size-4" /> Trading Fee
      </PopoverTrigger>
      <PopoverContent className="p-4 text-sm" align="start">
        <h3 className="mb-2 text-base font-medium">Trading Fee</h3>
        <p className="text-muted-foreground text-xs">Following fee rates are applied to the trade:</p>
        <div className="text-muted-foreground grid grid-cols-2 gap-3 py-2 text-xs">
          <div className="flex gap-3">
            <div>Buy</div>
            <div className="text-foreground font-bold">{isLoading ? "-" : `${buyTaxRatio / 100n}%`}</div>
          </div>
          <div className="flex gap-2">
            <div>Sell</div>
            <div className="text-foreground font-bold">{isLoading ? "-" : `${sellTaxRatio / 100n}%`}</div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default TradingFeePopover
