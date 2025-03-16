"use client"

import {
  createColumnHelper,
  type PaginationState
} from "@tanstack/react-table"
import React, { useState } from "react"
import { type DaoPage } from "~/types/data"
import DataTable from "~/components/data-table"
import type { HomeSearchParams } from "~/lib/schema"
import { api } from "~/trpc/react"
import { type DaoSearchResult } from "~/server/service/dao"

interface Condition extends HomeSearchParams {
  pagination: PaginationState;
}

interface LiveTableProps {
  initialData: DaoSearchResult;
}

const LiveTable = ({ initialData }: LiveTableProps) => {
  const columnHelper = createColumnHelper<DaoPage>()
  const [condition, setCondition] = useState<Condition>({
    status: ["LAUNCHED"],
    orderBy: "latest",
    owned: false,
    starred: false,
    pagination: {
      pageSize: 10,
      pageIndex: 0
    }
  })
  const { data: response, isPending } = api.dao.search.useQuery({
    ...condition,
    ...condition.pagination
  }, { initialData })
  const columns = [
    columnHelper.accessor("id", {
      header: () => "#",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("name", {
      header: () => "Repo DAO",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("type", {
      header: () => "Type",
      cell: (info) => (
        <div className={"text-sm text-gray-400"}>${info.getValue()}</div>
      )
    }),
    columnHelper.accessor("tokenInfo.marketCap", {
      header: () => "Market Cap",
      cell: (info) => (
        <div className={"text-sm text-gray-400"}>${info.getValue()}</div>
      )
    }),
    columnHelper.accessor("tokenInfo.totalSupply", {
      header: () => "Total Supply",
      cell: (info) => (
        <div className={"text-sm text-gray-400"}>{info.getValue()}</div>
      )
    }),
    columnHelper.accessor("tokenInfo.holderCount", {
      header: () => "Holder Count",
      cell: (info) => (
        <div className={"text-sm text-gray-400"}>{info.getValue()}</div>
      )
    })
  ]
  return (
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
    />
  )
}

export default LiveTable
