import { SiGithub, SiIngress, SiX } from "@icons-pack/react-simple-icons"
import { House } from "lucide-react"
import CardWrapper from "~/components/card-wrapper"
import type { TeamData } from "~/types/data"

interface TeamItemProps {
  data: TeamData
  className?: string
}

const TeamItem = ({ data, className }: TeamItemProps) => {
  return (
    <CardWrapper key={`ccc-${data.name}-${data.title}-${data.sort}`} contentClassName={className}>
      <div className={"flex flex-col p-6 gap-4"}>
        <div className={"flex flex-row gap-6"}>
          <img alt={data.name} src={data.avatar} className={"rounded-full size-16"} />
          <div className={"flex flex-col gap-4"}>
            <div className={"flex flex-row gap-5 items-center"}>
              <div className={"text-xl"}>{data.name}</div>
              <div className={"font-thin text-lg text-white/50"}>{data.title}</div>
            </div>
            <div className={"flex flex-row gap-2"}>
              {data.website && (
                <a href={data.website}>
                  <House className={"size-4"} />
                </a>
              )}
              {data.ingress && (
                <a href={data.ingress}>
                  <SiIngress className={"size-4"} />
                </a>
              )}
              {data.x && (
                <a href={data.x}>
                  <SiX className={"size-4"} />
                </a>
              )}
              {data.github && (
                <a href={data.github}>
                  <SiGithub className={"size-4"} />
                </a>
              )}
            </div>
          </div>
        </div>
        <div className={"mt-2 text-white/50 line-clamp-4 overflow-hidden text-ellipsis break-all"}>{data.description}</div>
      </div>
    </CardWrapper>
  )
}

export default TeamItem
