"use client"

import Image from "next/image"
import CardWrapper from "~/components/card-wrapper"
import { cn } from "~/lib/utils"

interface RoadmapPlaceholderProps {
  id: string
}

const RoadmapPlaceholder = ({ id }: RoadmapPlaceholderProps) => {
  return (
    <div className={"my-20"}>
      <div className={"text-4xl font-bold tracking-tight"}>Roadmap</div>
      <div className={"pt-8 relative justify-center text-center"}>
        <div className={"absolute top-52 flex justify-center items-center w-full text-lg md:text-2xl font-bold z-10"}>
          <a href={`/dao/${id}/edit/roadmap`} className={"bg-primary px-4 py-2 rounded-lg transition-transform transform hover:scale-105 hover:bg-primary-dark hover:shadow-lg"}>
            Fill in your complete roadmap
          </a>
        </div>
        <div className={"flex flex-col gap-6 blur-md"}>
          {[1, 2, 3, 4, 5].map((item) => (
            <CardWrapper key={`cms-roadmap-${item}`} contentClassName={cn("relative w-full min-h-[68px] relative flex justify-center items-center ", item > 3 && "min-h-[92px]")}>
              <Image src={`https://storage.googleapis.com/repofi-prod/launchpad/image/roadmap_blur_${item}.png`} fill={true} alt={"member"} />
            </CardWrapper>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RoadmapPlaceholder
