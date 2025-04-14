import Link from "next/link"
import ShowDao from "~/app/_components/show-dao"
import LiveDao from "~/app/_components/live-dao"
import BannerWrapper from "~/components/banner-wrapper"
import AiButton from "~/components/ui/ai-button"
import { ContainerTextFlip } from "~/components/ui/container-text-flip"
import type { HomeSearchParams } from "~/lib/schema"
import { formatMoney } from "~/lib/utils"
import { api } from "~/trpc/server"

const LaunchpadPage = async ({
  searchParams
}: {
  searchParams: Promise<{
    launching_orderBy?: "latest" | "marketCap"
    launching_owned?: string
    launching_starred?: string
    launching_search?: string
    live_orderBy?: "latest" | "marketCap"
    live_owned?: string
    live_starred?: string
    live_search?: string
  }>
}) => {
  const params = await searchParams

  const initLaunchingParam: HomeSearchParams = {
    status: ["LAUNCHING"],
    search: params.launching_search ?? "",
    orderBy: params.launching_orderBy ?? "latest",
    owned: params.launching_owned === "true",
    starred: params.launching_starred === "true"
  }
  const initPreLaunchingParam: HomeSearchParams = {
    status: ["PRE_LAUNCH"],
    search: params.launching_search ?? "",
    orderBy: params.launching_orderBy ?? "latest",
    owned: params.launching_owned === "true",
    starred: params.launching_starred === "true"
  }
  const initLiveParam: HomeSearchParams = {
    status: ["LAUNCHED"],
    search: params.live_search ?? "",
    orderBy: params.live_orderBy ?? "latest",
    owned: params.live_owned === "true",
    starred: params.live_starred === "true"
  }
  const dashboard = await api.dashboard.home()

  return (
    <div className={"mt-10 min-h-full"}>
      <BannerWrapper className={"flex w-full flex-col pb-20"}>
        <div className={"items-left mt-10 flex w-full flex-col justify-between gap-5 font-bold md:text-left"}>
          <div className={"text-3xl md:text-5xl tracking-tight"}>
            <ContainerTextFlip words={["Create", "Fundraising", "Launch"]} /> Your DAO
          </div>
          <div className={"text-3xl md:text-5xl tracking-tight"}>with REPO Protocol</div>
          <div className={"text-md max-w-4xl font-thin text-white/70 space-y-2"}>
            The REPO Protocol serves as a decentralized financial layer designed to support open science and open source software. It operates on a dual-token system that includes
            $REPO, which is used for governance, alongside project tokens that provide incentives. Additionally, RepoDAO play a crucial role in facilitating sustainable funding,
            ensuring fair rewards, and promoting decentralized governance within the ecosystem.
          </div>
          <Link href="/create/bind">
            <AiButton>Create New DAO To Start</AiButton>
          </Link>
          <div className={"bg-secondary mt-6 flex max-w-3xl flex-col justify-between rounded-lg px-4 py-7 md:flex-row md:px-8"}>
            <div className={"mb-4 flex flex-col gap-2 md:mb-0"}>
              <div className={"text-2xl font-extrabold md:text-3xl"}>{dashboard.total} DAO</div>
              <div className={"text-sm font-thin text-white/70"}>Launched & Pre-Launch</div>
            </div>
            <div className={"mb-4 flex flex-col gap-2 border-t-1 border-white pt-4 md:mb-0 md:border-t-0 md:border-l-1 md:pt-0 md:pl-4"}>
              <div className={"text-2xl font-extrabold md:text-3xl"}>${`${formatMoney(String(dashboard.marketCap.PRE_LAUNCH ?? "0"))}`}</div>
              <div className={"text-sm font-thin text-white/70"}>Pre-Launch MarketCap</div>
            </div>
            <div className={"flex flex-col gap-2 border-t-1 border-white pt-4 md:border-t-0 md:border-l-1 md:pt-0 md:pl-4"}>
              <div className={"text-2xl font-extrabold md:text-3xl"}>${`${formatMoney(String(dashboard.marketCap.LAUNCHED ?? "0"))}`}</div>
              <div className={"text-sm font-thin text-white/70"}>Launched MarketCap</div>
            </div>
          </div>
        </div>
      </BannerWrapper>
      <ShowDao daoParam={initPreLaunchingParam} title="Pre Launch DAO" description="Discover DAOs preparing to launch. Browse project information, track their development, and stay informed about upcoming opportunities." />
      <ShowDao daoParam={initLaunchingParam} title="Launching DAO" description="Join early to fuel cutting-edge research, open collaboration, and reinvent scientific funding." />
      <LiveDao />
    </div>
  )
}

export default LaunchpadPage
