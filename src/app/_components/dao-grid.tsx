"use client"
import React, { type FC, useState } from "react"
import DaoCard from "~/app/_components/dao-card"
import DaoCardSkeleton from "~/app/_components/dao-card-skeleton"
import LoadingSpinner from "~/app/_components/loading-spinner"
import ListPagination from "~/components/list-pagination"
import NoData from "~/components/no-data"
import type { HomeSearchParams, Pageable } from "~/lib/schema"
import type { DaoSearchResult } from "~/server/service/dao"
import { api } from "~/trpc/react"

type Props = {
  initParam?: HomeSearchParams
  initialData?: DaoSearchResult
}

const DaoGrid: FC<Props> = ({
  initParam = {
    status: ["PRE_LAUNCH"],
    orderBy: "latest",
    owned: false,
    starred: false
  },
  initialData
}) => {
  const [pageable, setPageable] = useState<Pageable>({
    page: 0,
    size: 6
  })
  const { data: response, isPending } = api.dao.search.useQuery(
    {
      ...pageable,
      ...initParam
    },
    { initialData: initialData }
  )
  if (isPending) {
    return (
      <div className={"grid grid-cols-1 gap-x-2 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"}>
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <DaoCardSkeleton key={`dao-skeleton-${index}`} />
          ))}
      </div>
    )
  }

  return (
    <div className={"grid grid-cols-1 gap-x-2 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"}>
      {response && response?.list.length > 0 ? (
        <>
          {response?.list.map((item) => (
            <DaoCard data={item} key={`launching-dao-${item.id}`} />
          ))}
          <div className={"col-span-1 mt-6 sm:col-span-2 lg:col-span-3"}>
            <ListPagination pageable={pageable} totalPages={response?.pages ?? 0} setPageable={setPageable} />
          </div>
        </>
      ) : (
        <NoData size={96} className={"col-span-1 my-20 sm:col-span-2 lg:col-span-3"} />
      )}
    </div>
  )
}

export default DaoGrid
