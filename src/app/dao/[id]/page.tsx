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
import { type ContributorPage } from "~/server/service/contributor"
import { type Top10Holders } from "~/server/service/holder"
import Banner from "~/app/dao/[id]/_components/banner"

const DaoPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const daoDetail: DaoDetailResult = await api.dao.detail({ daoId: id })
  if (daoDetail === null) {
    return <div>No Data</div>
  }
  const contributorList: ContributorPage =
    await api.contributor.getContributors({
      daoId: id,
      page: 0,
      size: 10
    })
  const top10Holders: Top10Holders = await api.holder.getTop10Holders({
    tokenId: daoDetail.tokenId
  })
  return (
    <div className={"mt-20 min-h-full"}>
      <Banner id={id} daoDetail={daoDetail} />
      <div className={"mx-4 max-w-7xl md:mx-auto"}>
        <DaoContent data={daoDetail} initContributorList={contributorList} top10Holders={top10Holders} />
        <ArticleList />
        <TeamList />
        <Roadmap />
        <Content />
      </div>
    </div>
  )
}

export default DaoPage
