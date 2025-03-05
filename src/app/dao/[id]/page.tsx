import BannerWrapper from "~/components/banner-wrapper"
import CardWrapper from "~/components/card-wrapper"
import Image from "next/image"
import { SiDiscord, SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import DaoContent from "~/app/dao/[id]/_components/main"
import ArticleList from "~/app/dao/[id]/_components/article-list"
import TeamList from "~/app/dao/[id]/_components/team-list"
import Roadmap from "~/app/dao/[id]/_components/roadmap"
import Content from "~/app/dao/[id]/_components/content"

const DaoPage = () => {
  return (
    <div className={"mt-20 min-h-full"}>
      <BannerWrapper className={"flex w-full flex-col"}>
        <div className={"my-10 flex w-full flex-col gap-8 md:flex-row"}>
          <CardWrapper>
            <Image
              height={220}
              width={335}
              alt={"banner"}
              src={
                "http://downloads.echocow.cn/85936f2e95327e9e778b198c9b10fd6f.png"
              }
            />
          </CardWrapper>
          <div className={"flex flex-col flex-1"}>
            <div className={"flex flex-row items-center gap-x-2"}>
              <div className={"text-5xl font-bold tracking-tighter"}>
                VUE DAO
              </div>
              <SiX className={"ml-6"} />
              <SiDiscord />
              <SiTelegram />
            </div>
            <div className={"mt-2 text-gray-500"}>
              Repository: https://github.com/vuejs/vue
            </div>
            <div className={"mt-1 flex flex-row gap-4 text-sm"}>
              <div>License: MIT</div>
              <div className={"border-l border-gray-400 pl-4"}>Stars: 206k</div>
              <div className={"border-l border-gray-400 pl-4"}>Watch: 5.6k</div>
              <div className={"border-l border-gray-400 pl-4"}>Forks: 332k</div>
            </div>
            <div className={"text-sm mt-4"}>
              AgentZero is the first AI agent of wallstreetbets, brought to life
              by its founder, Jaime Rogozinski. He’s not just a mascot—he’s a
              movement embodied. AgentZero carries the weight of Jaime’s
              struggle, from building WallStreetBets into an empire to fighting
              against corporate overreach after Reddit took what was his.
            </div>
          </div>
        </div>
      </BannerWrapper>
      <div className={"max-w-7xl mx-auto"}>
        <DaoContent />
        <ArticleList />
        <TeamList />
        <Roadmap />
        <Content />
      </div>
    </div>
  )
}

export default DaoPage
