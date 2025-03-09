"use client"

import CardWrapper from "~/components/card-wrapper"
import DaoCard from "~/app/_components/dao-card"
import { api } from "~/trpc/react"
import { useState } from "react"
import { type HomeSearchParams, type Pageable } from "~/lib/schema"

const LaunchingDao = () => {
  const [pageable, setPageable] = useState<Pageable>({
    page: 0,
    size: 9
  })
  const [param, setParam] = useState<HomeSearchParams>({
    orderBy: "latest",
    status: ["LAUNCHING"],
    owned: false,
    starred: false
  })
  const { data: response } = api.dao.homeSearch.useQuery({
    ...pageable,
    ...param
  })
  console.log(response)
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
      <div className={"grid grid-cols-3"}>
        {response && response?.data.length > 0 ? (
          response?.data.map((item) => (
            <DaoCard data={item} key={`launching-dao-${item.id}`}/>
          ))
        ) : (
          <div>No Data</div>
        )}
      </div>
    </div>
  )
}

export default LaunchingDao
