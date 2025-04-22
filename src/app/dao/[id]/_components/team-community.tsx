"use client"
import { SiDiscord, SiIngress, SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import { House, Settings } from "lucide-react"
import { useMemo } from "react"
import TeamItem from "~/app/dao/[id]/_components/team-item"
import CardWrapper from "~/components/card-wrapper"
import type { DaoLinks } from "~/lib/schema"
import type { DaoDetailResult } from "~/server/service/dao"
import type { TeamContentParams, TeamData } from "~/types/data"

interface TeamCommunityProps {
  data: TeamContentParams
  dao: DaoDetailResult
  isOwned: boolean
  id: string
}

const TeamCommunity = ({ data, dao, isOwned, id }: TeamCommunityProps) => {
  const list = data.data as TeamData[]
  if (list.length === 0) {
    return <></>
  }
  const linksData = useMemo(() => {
    const links: DaoLinks = dao.links as DaoLinks
    return links.map((link) => {
      switch (link.type) {
        case "telegram":
          return {
            icon: <SiTelegram className={"size-4"} />,
            link: link.value,
            title: "Telegram community",
            tip: "Join our Telegram"
          }
        case "x":
          return {
            icon: <SiX className={"size-4"} />,
            link: link.value,
            title: "Latest activities on X",
            tip: "Follow on X"
          }
        case "discord":
          return {
            icon: <SiDiscord className={"size-4"} />,
            link: link.value,
            title: "Discord community",
            tip: "Join our Discord"
          }
        case "website":
          return {
            icon: <House className={"size-4"} />,
            link: link.value,
            title: "About us",
            tip: "Go homepage"
          }
        default:
          return {
            icon: null,
            link: null,
            title: "Unknown"
          }
      }
    })
  }, [dao])
  return (
    <div className={"flex flex-col my-10"}>
      <div className={"text-4xl font-bold tracking-tight flex flex-row items-center gap-4"}>
        {data.title}
        {isOwned && (
          <a href={`/dao/${id}/edit/team`}>
            <Settings className={"hover:animate-spin"} />
          </a>
        )}
      </div>
      <div className={"grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"}>
        {list.map((item, index) => (
          <TeamItem data={item} key={`${item.name}-${item.title}-${item.sort}`} />
        ))}
      </div>
      <div className={"grid grid-cols-1 md:grid-cols-2 gap-8 mt-8"}>
        {linksData.map((item, index) => (
          <CardWrapper key={`${item.title}-${item.link}-links`}>
            <div className={"flex flex-col p-6 gap-4 bg-secondary"}>
              <div className={"text-xl font-bold mx-auto"}>{item.title}</div>
              <a
                href={item.link ?? ""}
                target={"_blank"}
                rel="noreferrer"
                className={"text-xs px-4 py-2 border border-white rounded-xl flex flex-row gap-1 items-center max-w-max mx-auto"}
              >
                {item.icon}
                {item.tip}
              </a>
            </div>
          </CardWrapper>
        ))}
      </div>
    </div>
  )
}

export default TeamCommunity
