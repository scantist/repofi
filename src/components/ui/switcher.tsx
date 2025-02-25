import {Switch} from "~/components/ui/switch"
import {Label} from "~/components/ui/label"
import {cn} from "~/lib/utils"

const Switcher = ({
                    value,
                    label,
                    handleChange
                  }: {
  value: boolean;
  label: string;
  handleChange: (value: boolean) => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      <Switch
        checked={value}
        onCheckedChange={handleChange}
        id={`filter-${label}`}
      />
      <Label
        htmlFor={`filter-${label}`}
        className={cn(
          "text-sm cursor-pointer",
          value ? "text-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </Label>
    </div>
  )
}


export default Switcher
