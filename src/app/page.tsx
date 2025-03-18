import BannerWrapper from "~/components/banner-wrapper"
import LaunchingDao from "~/app/_components/launching-dao"
import LiveDao from "~/app/_components/live-dao"
import { api } from "~/trpc/server"
import type { DaoSearchResult } from "~/server/service/dao"
import type { HomeSearchParams } from "~/lib/schema"

const LaunchpadPage = async ({
  searchParams
}: {
  searchParams: Promise<{
    launching_orderBy?: "latest" | "marketCap",
    launching_owned?: boolean,
    launching_starred?: boolean,
    launching_search?: string,
    live_orderBy?: "latest" | "marketCap",
    live_owned?: boolean,
    live_starred?: boolean,
    live_search?: string,
  }>
}) => {
  const params = await searchParams

  const initLaunchingParam: HomeSearchParams = {
    status: ["LAUNCHING"],
    search: params.launching_search?? "",
    orderBy: params.launching_orderBy ?? "latest",
    owned: params.launching_owned ?? false,
    starred: params.launching_starred ?? false
  }
  const initLiveParam: HomeSearchParams = {
    status: ["LAUNCHED"],
    search: params.live_search?? "",
    orderBy: params.live_orderBy ?? "latest",
    owned: params.live_owned ?? false,
    starred: params.live_starred ?? false
  }

  const launchingDao: DaoSearchResult = await api.dao.search({
    ...initLaunchingParam,
    size: 6,
    page: 0
  })

  console.log(initLaunchingParam, launchingDao)

  const liveDao: DaoSearchResult = await api.dao.search({
    ...initLiveParam,
    size: 6,
    page: 0
  })
  console.log("launchingDao", launchingDao.total, "liveDao", liveDao.total)
  return (
    <div className={"mt-10 min-h-full"}>
      <BannerWrapper className={"flex w-full flex-col pb-20"}>
        <div
          className={
            "items-left mt-10 flex w-full flex-col justify-between gap-5 font-bold md:text-left"
          }
        >
          <div className={"text-5xl tracking-tight"}>Curate & Fund</div>
          <div className={"text-5xl tracking-tight"}>Decentralized Science</div>
          <div className={"text-md max-w-3xl font-thin text-white/70"}>
            REPO Protocol is a decentralized financial layer revolutionizing
            open science and open source software. Through a dual-token
            model—$REPO for governance and repository-specific tokens for
            incentives—it optimizes funding, valuation, and collaboration.
            RepoDAOs ensure sustainable funding, fair rewards, and decentralized
            governance, driving the democratization of AI and technology.
          </div>
          <div
            className={
              "bg-secondary mt-6 flex max-w-3xl flex-col justify-between rounded-lg px-4 py-7 md:flex-row md:px-8"
            }
          >
            <div className={"mb-4 flex flex-col gap-2 md:mb-0"}>
              <div className={"text-2xl font-extrabold md:text-3xl"}>
                10 DAOs
              </div>
              <div className={"text-sm font-thin text-white/70"}>
                Launched & Funded
              </div>
            </div>
            <div
              className={
                "mb-4 flex flex-col gap-2 border-t-1 border-white pt-4 md:mb-0 md:border-t-0 md:border-l-1 md:pt-0 md:pl-4"
              }
            >
              <div className={"text-2xl font-extrabold md:text-3xl"}>$33M</div>
              <div className={"text-sm font-thin text-white/70"}>
                Raised for Research
              </div>
            </div>
            <div
              className={
                "flex flex-col gap-2 border-t-1 border-white pt-4 md:border-t-0 md:border-l-1 md:pt-0 md:pl-4"
              }
            >
              <div className={"text-2xl font-extrabold md:text-3xl"}>$7.4M</div>
              <div className={"text-sm font-thin text-white/70"}>
                Deployed in Research
              </div>
            </div>
          </div>
        </div>
      </BannerWrapper>
      <LaunchingDao initialData={launchingDao} daoParam={initLaunchingParam}/>
      <LiveDao initialData={liveDao} />
    </div>
  )
}

export default LaunchpadPage
