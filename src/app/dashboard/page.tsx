import BannerWrapper from "~/components/banner-wrapper"
import OverviewCard from "~/app/dashboard/_components/overview-card"
import LineCard from "~/app/dashboard/_components/line-card"
import ContributorCard from "~/app/dashboard/_components/contributor-card"
import DaoCard from "~/app/dashboard/_components/dao-card"

const DashboardPage = () => {
  return (
    <div className={"mt-10 min-h-full"}>
      <BannerWrapper className={"flex w-full flex-col pb-20"}>
        <div
          className={"flex w-full flex-col items-left justify-between text-4xl mt-10 font-bold tracking-tight md:text-left"}
        >
          Repofi Protocol Dashboard
        </div>
        <div className={"w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-8"}>
          <OverviewCard />
          <OverviewCard />
          <OverviewCard />
          <OverviewCard />
          <div className={"md:col-span-2"}>
            <LineCard />
          </div>
          <div className={"md:col-span-2"}>
            {/*<ContributorCard initContributorList/>*/}
          </div>
        </div>
      </BannerWrapper>
      <div className={"mx-auto flex min-h-full w-full max-w-7xl gap-10 px-4 pt-10 pb-10 flex-col"}>
        <div className={"text-4xl font-bold mt-10"}>DAOS</div>
        <DaoCard />
      </div>
    </div>
  )
}
export default DashboardPage
