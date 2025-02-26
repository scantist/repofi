import {cn} from "~/lib/utils"

const SortOptions = [
  {
    name: "Top Market Cap",
    value: "marketCap"
  },
  {
    name: "Latest",
    value: "latest"
  }
] as const

const Sorter = ({
                  sortByValue,
                  handleOrderChange,
                  className
                }: {
  sortByValue: "marketCap" | "latest";
  handleOrderChange: (value: "marketCap" | "latest") => void;
  className?: string;
}) => {
  return (
    <div className={cn("bg-muted flex gap-1 rounded-lg p-1", className)}>
      {SortOptions.map((item) => (
        <button
          key={item.value}
          className={cn(
            "h-9 basis-1/2 rounded text-sm transition-all cursor-pointer",
            sortByValue === item.value
              ? "bg-primary text-foreground"
              : "text-muted-foreground bg-transparent",
          )}
          onClick={() => {
            handleOrderChange(item.value)
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  )
}


export default Sorter
