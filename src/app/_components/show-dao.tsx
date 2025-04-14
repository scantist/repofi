"use client"

import DaoFilter from "~/app/_components/dao-filter"
import CardWrapper from "~/components/card-wrapper"
import type { HomeSearchParams } from "~/lib/schema"
import type { DaoSearchResult } from "~/server/service/dao"
import DaoGrid from "./dao-grid"

interface ShowDaoProps {
  initialData?: DaoSearchResult
  daoParam?: HomeSearchParams
  title: string
  description: string
}

const ShowDao = ({
  initialData,
  daoParam = {
    search: "",
    orderBy: "latest",
    owned: false,
    starred: false
  },
  title,
  description
}: ShowDaoProps) => {
  return (
    <div className={"mx-0 md:mx-auto flex min-h-full w-full max-w-7xl flex-col gap-4 px-4 pt-10 pb-10"}>
      <DaoFilter title={title} prefix={"launching_"} daoParam={daoParam} />
      <div className={"text-muted-foreground text-sm font-thin"}>{description}</div>
      <DaoGrid initialData={initialData} initParam={daoParam} />
    </div>
  )
}

export default ShowDao
