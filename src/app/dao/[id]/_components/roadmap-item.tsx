import { format, parse } from "date-fns/fp"
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
    <CardWrapper>
      <div className={"flex flex-row gap-x-8 px-10 py-4"}>
        <div className={"text-primary text-3xl font-bold"}>{formattedDate}</div>
        <div className={"flex-1"}>
          <div className={"text-sm font-thin"}>{data.description}</div>
        </div>
      </div>
    </CardWrapper>
  )
}

export default RoadmapItem
