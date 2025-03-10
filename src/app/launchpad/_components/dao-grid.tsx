"use client"
import { type FC, useMemo, useState } from "react"
import type { HomeSearchParams, Pageable } from "~/lib/schema"
import { api } from "~/trpc/react"
import DaoCard from "~/app/_components/dao-card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "~/components/ui/pagination"
import ListPagination from "~/components/list-pagination"

type Props = {
  initParam?: HomeSearchParams;
};

const DaoGrid: FC<Props> = ({
  initParam = {
    orderBy: "latest",
    owned: false,
    starred: false
  }
}) => {
  const [pageable, setPageable] = useState<Pageable>({
    page: 0,
    size: 6
  })
  const [param, setParam] = useState<HomeSearchParams>(initParam)
  const { data: response, isPending } = api.dao.homeSearch.useQuery({
    ...pageable,
    ...param
  })

  if (isPending) {
    return <div>Loading...</div>
  }

  return (
    <div className={"grid grid-cols-3"}>
      {response && response?.list.length > 0 ? (
        <>
          {response?.list.map((item) => (
            <DaoCard data={item} key={`launching-dao-${item.id}`} />
          ))}
          <div className={"col-span-3 mt-6"}>
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
