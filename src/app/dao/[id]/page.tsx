import ArticleList from "~/app/dao/[id]/_components/article-list"
import Banner from "~/app/dao/[id]/_components/banner"
import Content from "~/app/dao/[id]/_components/content"
import Roadmap from "~/app/dao/[id]/_components/roadmap"
import TeamList from "~/app/dao/[id]/_components/team-list"
import DaoContent from "~/app/dao/[id]/main"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"
import type { ListRowContentParams } from "~/types/data"

const DaoPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const daoDetail: DaoDetailResult = await api.dao.detail({ daoId: id })
  if (daoDetail === null) {
    return <div>No Data</div>
  }
  const [contributorList, top10Holders] = await Promise.all([
    api.contributor.getContributors({
      daoId: id,
      page: 0,
      size: 10
    }),
    api.holder.getTop10Holders({
      tokenId: daoDetail.tokenId
    })
  ])
  const sortedContents = daoDetail.contents.sort((a, b) => a.sort - b.sort)
  return (
    <div className={"mt-20 min-h-full"}>
      <Banner id={id} daoDetail={daoDetail} />
      <div className={"mx-4 max-w-7xl md:mx-auto"}>
        <DaoContent data={daoDetail} initContributorList={contributorList} top10Holders={top10Holders} />
        {sortedContents.map((content) => {
          switch (content.type) {
            case "LIST_ROW":
              return <ArticleList key={content.id} data={content as ListRowContentParams} />
            case "TEAM_COMMUNITY":
              return <TeamList key={content.id} />
            case "ROADMAP":
              return <Roadmap key={content.id} />
            default:
              return <Content key={content.id} />
          }
        })}
        <TeamList />
        <Roadmap />
        <Content />
      </div>
    </div>
  )
}

export default DaoPage
