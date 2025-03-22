"use client"

import CardWrapper from "~/components/card-wrapper"
import DaoGrid from "./dao-grid"
import type { DaoSearchResult } from "~/server/service/dao"
import DaoFilter from "~/app/_components/dao-filter"
import { type HomeSearchParams } from "~/lib/schema"

interface LaunchingDaoProps {
  initialData?: DaoSearchResult
  daoParam?: HomeSearchParams
}

const LaunchingDao = ({
  initialData,
  daoParam = {
    search: "",
    orderBy: "latest",
    owned: false,
    starred: false
  }
}: LaunchingDaoProps) => {
  return (
    <div className={"mx-0 md:mx-auto flex min-h-full w-full max-w-7xl flex-col gap-8 px-4 pt-10 pb-10"}>
      <DaoFilter title={"Currently Fundraising"} prefix={"launching_"} daoParam={daoParam} />
      <CardWrapper>
        <div className={"p-4 text-sm font-thin"}>
          Join DeSci by participating in the early stage funding of new BioDAOs. Your participation fuels cutting-edge research, open collaboration, and new models of scientific
          funding.
        </div>
      </CardWrapper>
      <DaoGrid initialData={initialData} initParam={daoParam} />
    </div>
  )
}

export default LaunchingDao
