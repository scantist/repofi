import BannerWrapper from "~/components/banner-wrapper"
import LaunchingDao from "~/app/_components/launching-dao"
import LiveDao from "~/app/_components/live-dao"
import { api } from "~/trpc/server"
import type { DaoSearchResult } from "~/server/service/dao"
import type { HomeSearchParams } from "~/lib/schema"
import { Button } from "~/components/ui/button"
import Link from "next/link"
import { formatMoney } from "~/lib/utils"

const LaunchpadPage = async ({
  searchParams
}: {
  searchParams: Promise<{
    launching_orderBy?: "latest" | "marketCap"
    launching_owned?: boolean
    launching_starred?: boolean
    launching_search?: string
    live_orderBy?: "latest" | "marketCap"
    live_owned?: boolean
    live_starred?: boolean
    live_search?: string
  }>
}) => {
  const params = await searchParams

  const initLaunchingParam: HomeSearchParams = {
    status: ["LAUNCHING"],
    search: params.launching_search ?? "",
    orderBy: params.launching_orderBy ?? "latest",
    owned: params.launching_owned ?? false,
    starred: params.launching_starred ?? false
  }
  const initLiveParam: HomeSearchParams = {
    status: ["LAUNCHED"],
    search: params.live_search ?? "",
    orderBy: params.live_orderBy ?? "latest",
    owned: params.live_owned ?? false,
    starred: params.live_starred ?? false
  }
  const dashboard = await api.dashboard.home()

  return (
    <div className={"mt-10 min-h-full"}>
      <BannerWrapper className={"flex w-full flex-col pb-20"}>
        <div className={"items-left mt-10 flex w-full flex-col justify-between gap-5 font-bold md:text-left"}>
          <div className={"text-5xl tracking-tight"}>Curate & Fund</div>
          <div className={"text-5xl tracking-tight"}>Decentralized Science</div>
          <div className={"text-md max-w-4xl font-thin text-white/70 space-y-2"}>
            <p>REPO Protocol: A decentralized financial layer for open science & open source software.</p>
            <p>Dual-Token System: $REPO (governance) + project tokens (incentives).</p>
            <p>RepoDAOs: Power sustainable funding, fair rewards, and decentralized governance.</p>
          </div>
          <Link href="/create/bind">
            <Button variant={"outline"} className={"max-w-52 bg-transparent text-xl h-14"}>
              Create
            </Button>
          </Link>
          <div className={"bg-secondary mt-6 flex max-w-3xl flex-col justify-between rounded-lg px-4 py-7 md:flex-row md:px-8"}>
            <div className={"mb-4 flex flex-col gap-2 md:mb-0"}>
              <div className={"text-2xl font-extrabold md:text-3xl"}>{dashboard.total} DAOs</div>
              <div className={"text-sm font-thin text-white/70"}>Launched & Launching</div>
            </div>
            <div className={"mb-4 flex flex-col gap-2 border-t-1 border-white pt-4 md:mb-0 md:border-t-0 md:border-l-1 md:pt-0 md:pl-4"}>
              <div className={"text-2xl font-extrabold md:text-3xl"}>${`${formatMoney(String(dashboard.marketCap.LAUNCHING ?? "0"))}`}</div>
              <div className={"text-sm font-thin text-white/70"}>Launching MarketCap</div>
            </div>
            <div className={"flex flex-col gap-2 border-t-1 border-white pt-4 md:border-t-0 md:border-l-1 md:pt-0 md:pl-4"}>
              <div className={"text-2xl font-extrabold md:text-3xl"}>${`${formatMoney(String(dashboard.marketCap.LAUNCHED ?? "0"))}`}</div>
              <div className={"text-sm font-thin text-white/70"}>Launched MarketCap</div>
            </div>
          </div>
        </div>
      </BannerWrapper>
      <LaunchingDao daoParam={initLaunchingParam} />
      <LiveDao />
    </div>
  )
}

export default LaunchpadPage
