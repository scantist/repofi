import { Slider } from "~/components/ui/slider";
import { cn } from "~/lib/utils";

export default function AmountInSlider({
  amountIn,
  balance,
  onAmountInChange,
  className,
}: {
  amountIn: bigint;
  balance: bigint | undefined;
  onAmountInChange: (amountIn: bigint) => void;
  className?: string;
}) {
  const handleValueChange = (value: number | undefined) => {
    if (balance && value !== undefined) {
      const amount = (balance * BigInt(value)) / 100n;
      onAmountInChange(amount);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex justify-between text-xs text-muted-foreground">
        <button
          type="button"
          className="-ml-1 w-4 text-center"
          onClick={() => handleValueChange(0)}
        >
          0
        </button>
        <button type="button" onClick={() => handleValueChange(25)}>1/4</button>
        <button type="button" onClick={() => handleValueChange(50)}>1/2</button>
        <button type="button" onClick={() => handleValueChange(75)}>3/4</button>
        <button type="button" className="-mr-2" onClick={() => handleValueChange(100)}>
          Max
        </button>
      </div>
      <Slider
        value={[balance ? Number((amountIn * 100n) / balance) : 0]}
        onValueChange={([value]) => handleValueChange(value)}
        disabled={!balance}
        min={0}
        max={100}
        step={5}
      />
    </div>
  );
}
