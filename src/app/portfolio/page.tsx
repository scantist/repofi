import { CircleArrowRight } from "lucide-react"
import BannerWrapper from "~/components/banner-wrapper"
import PortfolioTable from "~/app/portfolio/_components/portfolio-table"

const PortfolioPage = () => {
  return <div className={"mt-20 flex-col max-w-7xl mx-auto flex min-h-full w-full px-4"}>
    <div className={"text-5xl leading-32 font-bold tracking-tight"}>My Portfolio</div>
    <div className={"grid grid-cols-1 md:grid-cols-4 gap-8"}>
      <div className={"col-span-1 md:col-span-3 bg-secondary rounded-lg p-5 flex flex-col"}>
        <div>Connect your wallet to see your Portfolio</div>
        <div className={"border border-secondary-foreground mt-5 rounded-lg px-4 py-2 max-w-max"}>Connect Wallet</div>
      </div>
      <div className={"col-span-1 border border-white rounded-lg flex flex-row justify-between p-5 items-center text-3xl"}>
        <div>Govern</div>
        <div><CircleArrowRight /></div>
      </div>
    </div>
    <BannerWrapper wrapperClassName={"mt-10 rounded-lg"} className={"flex flex-col gap-4"}>
      <div className={"text-4xl tracking-tight"}>Repofi Rewards Are Here!</div>
      <div className={"max-w-2xl font-thin text-white/70"}>If you participated in Auction Round 1, you may be eligible for  additional Repofi rewards. Click here to check your eligibility and claim!</div>
      <div className={"border border-white rounded-lg py-1 cursor-pointer px-5 max-w-max"}>Airdrop</div>
    </BannerWrapper>
    <div className={"w-full my-10"}>
      <PortfolioTable />
    </div>
  </div>
}

export default PortfolioPage
