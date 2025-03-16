import BannerWrapper from "~/components/banner-wrapper"
import LaunchingDao from "~/app/_components/launching-dao"
import LiveDao from "~/app/_components/live-dao"

const LaunchpadPage = () => {
  return <div className={"mt-10 min-h-full"}>
    <BannerWrapper className={"flex w-full flex-col pb-20"}>
      <div
        className={"flex w-full flex-col gap-5 items-left justify-between mt-10 font-bold md:text-left"}
      >
        <div className={"text-5xl  tracking-tight"}>Curate & Fund</div>
        <div className={"text-5xl tracking-tight"}>Decentralized Science</div>
        <div className={"text-md font-thin text-white/70 max-w-3xl"}>
          Welcome to the BIO Launchpad. Vote on the best biotech DAOs to join the ecosystem, and participate in bioDAO
          token auctions.
          Discover what&#39;s happening in the BIO ecosystem below!
        </div>
        <div
          className={"max-w-3xl flex flex-col md:flex-row justify-between mt-6 py-7 px-4 md:px-8 rounded-lg bg-secondary"}>
          <div className={"flex flex-col gap-2 mb-4 md:mb-0"}>
            <div className={"font-extrabold text-2xl md:text-3xl"}>10 DAOs</div>
            <div className={"text-sm font-thin text-white/70"}>Launched & Funded</div>
          </div>
          <div
            className={"flex flex-col gap-2 mb-4 md:mb-0 md:pl-4 border-t-1 md:border-t-0 md:border-l-1 border-white pt-4 md:pt-0"}>
            <div className={"font-extrabold text-2xl md:text-3xl"}>$33M</div>
            <div className={"text-sm font-thin text-white/70"}>Raised for Research</div>
          </div>
          <div
            className={"flex flex-col gap-2 md:pl-4 border-t-1 md:border-t-0 md:border-l-1 border-white pt-4 md:pt-0"}>
            <div className={"font-extrabold text-2xl md:text-3xl"}>$7.4M</div>
            <div className={"text-sm font-thin text-white/70"}>Deployed in Research</div>
          </div>
        </div>
      </div>
    </BannerWrapper>
    <LaunchingDao/>
    <LiveDao/>
  </div>
}

export default LaunchpadPage
