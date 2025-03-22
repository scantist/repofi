import RoadmapItem from "~/app/dao/[id]/_components/roadmap-item"
import type { RoadmapContentParams, RoadmapData } from "~/types/data"

interface RoadmapProps {
  data: RoadmapContentParams
}

const Roadmap = ({ data }: RoadmapProps) => {
  const list = data.data as RoadmapData[]
  if (list.length === 0) {
    return <></>
  }
  return (
    <div className={"my-10 py-20 flex flex-col"}>
      <div className={"text-4xl font-bold tracking-tight"}>{data.title}</div>
      <div className={"my-10 flex flex-col gap-6"}>
        {list.map((item, index) => (
          <RoadmapItem data={item} key={`r-${item}`} />
        ))}
      </div>
    </div>
  )
}

export default Roadmap
