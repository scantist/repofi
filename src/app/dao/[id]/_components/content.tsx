import type { InformationContentParams, RoadmapContentParams } from "~/types/data"

interface ContentProps {
  data: InformationContentParams
}

const Content = ({ data }: ContentProps) => {
  return (
    <div className={"my-10 pb-20 flex flex-col lg:flex-row"}>
      <div className={"flex flex-col flex-1"}>
        <div className={"text-4xl font-bold tracking-tight"}>{data.title}</div>

        <div className={"md:hidden mt-6 mb-6 max-w-full"}>
          <img alt={"K"} className={"w-full"} src={data.data.image} />
        </div>

        <div className={"text-white/50 text-md mt-0 lg:mt-10 lg:mr-20"}>{data.data.information}</div>
      </div>
      <div className={"hidden md:block max-w-[579px] mt-8 lg:mt-0 mx-auto"}>
        <img alt={"K"} className={"w-full"} src={data.data.image} />
      </div>
    </div>
  )
}

export default Content
