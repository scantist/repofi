import type { InformationContentParams, RoadmapContentParams } from "~/types/data"

interface ContentProps {
  data: InformationContentParams
}

const Content = ({ data }: ContentProps) => {
  return (
    <div className={"my-10 pb-20 flex flex-col lg:flex-row gap-6"}>
      <div className={"flex flex-col flex-1 overflow-hidden lg:max-h-[calc(100vh-200px)] lg:h-full"}>
        <div className={"text-4xl font-bold tracking-tight"}>{data.title}</div>

        <div className={"md:hidden mt-6 mb-6 max-w-full rounded-lg"}>
          <img alt={"K"} className={"w-full"} src={data.data.image} />
        </div>

        <div className={"text-white/50 text-md mt-4 lg:mt-10 lg:mr-20 overflow-auto scrollbar-thin scrollbar-thumb-primary/50 scrollbar-track-secondary/20 pr-4"}>
          <pre className={"text-wrap"}>{data.data.information}</pre>
        </div>
      </div>
      <div className={"hidden md:flex w-[579px] mt-8 lg:mt-0 mx-auto items-center justify-center"}>
        <img alt={"K"} className={"w-full"} src={data.data.image} />
      </div>
    </div>
  )
}

export default Content
