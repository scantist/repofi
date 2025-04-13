import type { DaoContentType } from "@prisma/client"
import ArticleList from "~/app/dao/[id]/_components/article-list"
import ArticlePlaceholder from "~/app/dao/[id]/_components/article-placeholder"
import Banner from "~/app/dao/[id]/_components/banner"
import Content from "~/app/dao/[id]/_components/content"
import ContentPlaceholder from "~/app/dao/[id]/_components/content-placeholder"
import Roadmap from "~/app/dao/[id]/_components/roadmap"
import RoadmapPlaceholder from "~/app/dao/[id]/_components/roadmap-placeholder"
import TeamCommunity from "~/app/dao/[id]/_components/team-community"
import { DaoProvider } from "~/app/dao/[id]/context"
import DaoContent from "~/app/dao/[id]/main"
import PreMain from "~/app/dao/[id]/pre-main"
import { TourWrapper } from "~/components/tour-wrapper"
import { TradingViewProvider } from "~/components/trade-view/provider"
import { compareStringToUpperCase } from "~/lib/utils"
import { auth } from "~/server/auth"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"
import type { InformationContentParams, ListRowContentParams, RoadmapContentParams, TeamContentParams } from "~/types/data"
import TeamPlaceholder from "./_components/team-placeholder"

const DaoPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const session = await auth()
  const daoDetail: DaoDetailResult = await api.dao.detail({ daoId: id })
  if (daoDetail === null) {
    return <div>No Data</div>
  }
  const sortedContents = daoDetail.contents.sort((a, b) => {
    if (a.sort !== b.sort) {
      return a.sort - b.sort
    }
    return a.title.localeCompare(b.title)
  })
  const isPreLaunch = daoDetail.status === "PRE_LAUNCH"
  const contentNoType = (type: DaoContentType) => {
    return isOwned && isPreLaunch && sortedContents.findIndex((c) => c.type === type) === -1
  }
  const isOwned = compareStringToUpperCase(daoDetail?.createdBy, session?.address)

  return (
    <DaoProvider initialDetail={daoDetail}>
      <TradingViewProvider>
        <TourWrapper>
          <div className={"mt-20 min-h-full"}>
            <Banner id={id} daoDetail={daoDetail} isOwned={isOwned} />
            <div className={"mx-4 max-w-7xl xl:mx-auto"}>
              {isPreLaunch ? <PreMain isOwned={isOwned} /> : <DaoContent />}
              {sortedContents.map((content) => {
                switch (content.type) {
                  case "LIST_ROW":
                    return <ArticleList key={content.id} data={content as ListRowContentParams} />
                  case "TEAM_COMMUNITY":
                    return <TeamCommunity key={content.id} data={content as TeamContentParams} dao={daoDetail} />
                  case "ROADMAP":
                    return <Roadmap key={content.id} data={content as RoadmapContentParams} />
                  case "INFORMATION":
                    return <Content key={content.id} data={content as InformationContentParams} />
                  default:
                    return <></>
                }
              })}
              {contentNoType("LIST_ROW") && <ArticlePlaceholder id={id} />}
              {contentNoType("TEAM_COMMUNITY") && <TeamPlaceholder id={id} />}
              {contentNoType("ROADMAP") && <RoadmapPlaceholder id={id} />}
              {contentNoType("INFORMATION") && <ContentPlaceholder id={id} />}
            </div>
          </div>
        </TourWrapper>
      </TradingViewProvider>
    </DaoProvider>
  )
}

export default DaoPage
