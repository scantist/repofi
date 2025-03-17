import BannerWrapper from "~/components/banner-wrapper"
import CardWrapper from "~/components/card-wrapper"
import Image from "next/image"
import { SiDiscord, SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import DaoContent from "~/app/dao/[id]/main"
import ArticleList from "~/app/dao/[id]/_components/article-list"
import TeamList from "~/app/dao/[id]/_components/team-list"
import Roadmap from "~/app/dao/[id]/_components/roadmap"
import Content from "~/app/dao/[id]/_components/content"
import { api } from "~/trpc/server"
import { type DaoDetailResult } from "~/server/service/dao"

const DaoPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const daoDetail: DaoDetailResult = await api.dao.detail({ daoId: id })
  if (daoDetail === null) {
    return <div>No Data</div>
  }
  return (
    <div className={"mt-20 min-h-full"}>
      <BannerWrapper className={"flex w-full flex-col"}>
        <div className={"my-10 flex w-full flex-col gap-8 md:flex-row"}>
          <CardWrapper className={"max-h-fit max-w-fit"}>
            <Image
              height={240}
              width={335}
              alt={"banner"}
              src={
                "https://storage.googleapis.com/repofi/launchpad/avatar/1741621897031_85936f2e95.png"
              }
            />
          </CardWrapper>
          <div className={"flex flex-1 flex-col"}>
            <div className={"flex flex-row items-center gap-x-2"}>
              <div className={"text-5xl font-bold tracking-tighter"}>
                {daoDetail.name}
              </div>
              <SiX className={"ml-6"} />
              <SiDiscord />
              <SiTelegram />
            </div>
            <div className={"mt-2 text-gray-500"}>
              Repository: {daoDetail.url}
            </div>
            <div className={"mt-1 flex flex-row gap-4 text-sm"}>
              <div>License: {daoDetail.license}</div>
              <div className={"border-l border-gray-400 pl-4"}>Stars: {daoDetail.repoStar}</div>
              <div className={"border-l border-gray-400 pl-4"}>Watch: {daoDetail.repoWatch}</div>
              <div className={"border-l border-gray-400 pl-4"}>Forks: {daoDetail.repoForks}</div>
            </div>
            <div className={"mt-4 text-sm"}>
              {daoDetail.description}
            </div>
          </div>
        </div>
      </BannerWrapper>
      <div className={"mx-4 max-w-7xl md:mx-auto"}>
        <DaoContent data={daoDetail} />
        <ArticleList />
        <TeamList />
        <Roadmap />
        <Content />
      </div>
    </div>
  )
}

export default DaoPage
