import BannerWrapper from "~/components/banner-wrapper"
import CardWrapper from "~/components/card-wrapper"
import DaoCard from "~/app/_components/dao-card"
import LiveDao from "~/app/launchpad/_components/live-dao"

const LaunchpadPage = () => {
  return <div className={"mt-10 min-h-full"}>
    <BannerWrapper className={"flex w-full flex-col pb-20"}>
      <div
        className={"flex w-full flex-col gap-5 items-left justify-between mt-10 font-bold md:text-left"}
      >
        <div className={"text-5xl  tracking-tight"}>Curate & Fund</div>
        <div className={"text-5xl tracking-tight"}>Decentralized Science</div>
        <div className={"text-md font-thin text-white/70 max-w-3xl"}>
          Welcome to the BIO Launchpad. Vote on the best biotech DAOs to join the  ecosystem, and participate in bioDAO token auctions.
          Discover what&#39;s  happening in the BIO ecosystem below!
        </div>
        <div className={"max-w-3xl flex flex-row justify-between mt-6 py-7 px-8 rounded-lg bg-secondary"}>
          <div className={"flex flex-col gap-2"}>
            <div className={"font-extrabold text-3xl"}>10 BioDAOs</div>
            <div className={"text-sm font-thin text-white/70"}>Launched & Funded</div>
          </div>
          <div className={"flex flex-col gap-2 pl-4 border-l-1 border-white"}>
            <div className={"font-extrabold text-3xl"}>$33M</div>
            <div className={"text-sm font-thin text-white/70"}>Raised for Research</div>
          </div>
          <div className={"flex flex-col gap-2 pl-4 border-l-1 border-white"}>
            <div className={"font-extrabold text-3xl"}>$7.4M</div>
            <div className={"text-sm font-thin text-white/70"}>Deployed in Research</div>
          </div>
        </div>
      </div>
    </BannerWrapper>
    <div className={"mx-auto flex min-h-full w-full max-w-7xl gap-8 px-4 pt-10 pb-10 flex-col"}>
      <div className={"text-4xl font-bold"}>Currently Fundraising</div>
      <CardWrapper>
        <div className={"p-4 text-sm font-thin"}>
          Join DeSci by participating in the early stage funding of new BioDAOs.  Your participation fuels cutting-edge research, open collaboration, and  new models of scientific funding.
        </div>
      </CardWrapper>
      <div className={"grid grid-cols-3"}>
        <DaoCard />
      </div>
    </div>
    <LiveDao />
  </div>
}

export default LaunchpadPage
