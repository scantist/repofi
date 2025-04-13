import { format, parse } from "date-fns/fp"
import { Trash2 } from "lucide-react"
import CardWrapper from "~/components/card-wrapper"
import type { RoadmapData } from "~/types/data"

interface RoadmapItemProps {
  data: RoadmapData
  onDelete?: () => void
}

const RoadmapItem = ({ data, onDelete }: RoadmapItemProps) => {
  const date = new Date(data.date)
  const formattedDate = format("d MMMM yyyy")(date)
  return (
    <CardWrapper className={"blur-md"}>
      <div className={"flex flex-col md:flex-row gap-y-4 gap-x-8 px-4 md:px-10 py-4"}>
        <div className={"text-primary text-xl md:text-3xl w-80 font-bold"}>{formattedDate}</div>
        <div className={"flex-1 flex flex-row gap-2 items-center"}>
          <div className={"text-sm font-thin"}>{data.description}</div>{" "}
          {onDelete && (
            <button type={"button"} onClick={onDelete} className="text-red-500/70 hover:text-red-700/70 transition-all cursor-pointer">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

export default RoadmapItem
