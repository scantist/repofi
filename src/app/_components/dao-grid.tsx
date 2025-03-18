"use client"
import { type FC, useState } from "react"
import type { HomeSearchParams, Pageable } from "~/lib/schema"
import { api } from "~/trpc/react"
import DaoCard from "~/app/_components/dao-card"
import ListPagination from "~/components/list-pagination"
import { type DaoSearchResult } from "~/server/service/dao"

type Props = {
  initParam?: HomeSearchParams;
  initialData?: DaoSearchResult;
};

const DaoGrid: FC<Props> = ({
  initParam = {
    status: ["LAUNCHING"],
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
    { initialData: initialData },
  )

  if (isPending) {
    return <div>Loading...</div>
  }

  return (
    <div
      className={
        "grid grid-cols-1 gap-x-2 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"
      }
    >
      {response && response?.list.length > 0 ? (
        <>
          {response?.list.map((item) => (
            <DaoCard data={item} key={`launching-dao-${item.id}`} />
          ))}
          <div className={"col-span-1 mt-6 sm:col-span-2 lg:col-span-3"}>
            <ListPagination
              pageable={pageable}
              totalPages={response?.pages ?? 0}
              setPageable={setPageable}
            />
          </div>
        </>
      ) : (
        <div>No Data</div>
      )}
    </div>
  )
}

export default DaoGrid
