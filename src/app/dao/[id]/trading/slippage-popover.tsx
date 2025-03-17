import { TrendingDown } from "lucide-react"
import { Popover, PopoverTrigger, PopoverContent } from "~/components/ui/popover"
import { Slider } from "~/components/ui/slider"

interface Props {
  slippage: number,
  setSlippage: (value: number) => void
}


const SlippagePopover = ({ slippage, setSlippage }: Props) => {
  return <Popover>
    <PopoverTrigger className="flex items-center gap-2 cursor-pointer">
      <TrendingDown className="size-4"/>
      Slippage:{" "}
      <span className="tabular-nums">{slippage.toFixed(1)}%</span>
    </PopoverTrigger>
    <PopoverContent className="p-4 text-sm" align="end">
      <h3 className="mb-2 text-base font-medium">Slippage</h3>
      <div className="flex justify-between py-3 text-xs text-muted-foreground">
        <div className="translate-x-0.5">1%</div>
        <div className="-translate-x-1">5%</div>
        <div>10%</div>
      </div>
      <Slider
        value={[slippage]}
        onValueChange={([value]) => value && setSlippage(value)}
        min={1}
        max={10}
        step={1}
        className="mb-3"
      />
    </PopoverContent>
  </Popover>
}

export default SlippagePopover
