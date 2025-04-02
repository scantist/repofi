"use client"

import { createColumnHelper, PaginationState } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import { useState } from "react"
import DataTable from "~/components/data-table"
import ListPagination from "~/components/list-pagination"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { HomeSearchParams } from "~/lib/schema"
import { formatMoney, formatSignificantDigits } from "~/lib/utils"
import { api } from "~/trpc/react"
import { DaoPage } from "~/types/data"

interface Condition extends HomeSearchParams {
  pagination: PaginationState
}

const PortfolioTable = () => {
  const columnHelper = createColumnHelper<DaoPage>()
  const [condition, setCondition] = useState<Condition>({
    orderBy: "marketCap",
    owned: true,
    starred: false,
    pagination: {
      pageSize: 10,
      pageIndex: 0
    }
  })
  const { data: response, isPending } = api.dao.search.useQuery(
    {
      ...condition,
      page: condition.pagination.pageIndex,
      size: condition.pagination.pageSize
    }
  )
  console.log(condition, response)
  const router = useRouter()
  const columns = [
    columnHelper.accessor("avatar", {
      header: () => "Avatar",
      cell: (info) => (
        <Avatar>
          <AvatarImage src={info.getValue()} />
          <AvatarFallback>{info.row.original.name}</AvatarFallback>
        </Avatar>
      )
    }),
    columnHelper.accessor("ticker", {
      header: () => "Ticker",
      cell: (info) => <div>${info.getValue()}</div>
    }),
    columnHelper.accessor("name", {
      header: () => "Repo DAO",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("type", {
      header: () => "Type",
      cell: (info) => <div className={"text-sm text-gray-400"}>{info.getValue()}</div>
    }),
    columnHelper.accessor("status", {
      header: () => "Status",
      cell: (info) => <div className={"text-sm text-gray-400"}>{info.getValue()}</div>
    }),
    columnHelper.accessor("tokenInfo.holderCount", {
      header: () => "Holders",
      cell: (info) => <div className={"text-sm text-gray-400"}>{info.getValue()}</div>
    }),
    columnHelper.accessor("marketCapUsd", {
      header: () => "Market Cap",
      cell: (info) => <div className={"text-sm text-gray-400"}>${formatMoney(info.getValue().length === 0 ? "0" : info.getValue())}</div>
    }),
    columnHelper.accessor("priceUsd", {
      header: () => "Price",
      cell: (info) => <div className={"text-sm text-gray-400"}>${formatSignificantDigits(info.getValue())}</div>
    })
  ]
  return (
    <>
      <DataTable<DaoPage>
        data={response}
        loading={isPending}
        columns={columns}
        onPaginationChange={(pagination) => {
          setCondition({
            ...condition,
            pagination
          })
        }}
        outPagination={condition.pagination}
        onRowClick={(row) => {
          router.push(`/dao/${row.original.id}`)
        }}
      >
        <div className={"py-4"}>
          <ListPagination
            pageable={{
              page: condition.pagination.pageIndex,
              size: condition.pagination.pageSize
            }}
            totalPages={response?.pages ?? 0}
            setPageable={(pageable) => {
              setCondition({
                ...condition,
                pagination: {
                  pageIndex: pageable.page,
                  pageSize: pageable.size
                }
              })
            }}
          />
        </div>
      </DataTable>
    </>
  )
}
export default PortfolioTable
