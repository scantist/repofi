"use client"

import CardWrapper from "~/components/card-wrapper"
import DaoGrid from "~/app/launchpad/_components/dao-grid"

const LaunchingDao = () => {
  return (
    <div
      className={
        "mx-auto flex min-h-full w-full max-w-7xl flex-col gap-8 px-4 pt-10 pb-10"
      }
    >
      <div className={"text-4xl font-bold"}>Currently Fundraising</div>
      <CardWrapper >
        <div className={"p-4 text-sm font-thin"}>
          Join DeSci by participating in the early stage funding of new
          BioDAOs. Your participation fuels cutting-edge research, open
          collaboration, and new models of scientific funding.
        </div>
      </CardWrapper>
      <DaoGrid initParam={{
        status: ["LAUNCHING"],
        orderBy: "latest",
        owned: false,
        starred: false
      }}/>
    </div>
  )
}

export default LaunchingDao
