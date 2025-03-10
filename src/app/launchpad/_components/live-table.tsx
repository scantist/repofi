"use client"

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  type PaginationState,
  useReactTable
} from "@tanstack/react-table"
import React, { Fragment, useState } from "react"
import { cn } from "~/lib/utils"
import CardWrapper from "~/components/card-wrapper"
import { type DaoPage } from "~/types/data"
import DataTable from "~/components/data-table"
import type { HomeSearchParams, Pageable } from "~/lib/schema"
import { api } from "~/trpc/react"

interface Condition extends HomeSearchParams{
  pagination: PaginationState;
}

const LiveTable = () => {
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
  const { data: response, isPending } = api.dao.homeSearch.useQuery({
    ...condition,
    ...condition.pagination
  })
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
    columnHelper.accessor("info.marketCap", {
      header: () => "Market Cap",
      cell: (info) => (
        <div className={"text-sm text-gray-400"}>${info.getValue()}</div>
      )
    }),
    columnHelper.accessor("info.totalSupply", {
      header: () => "Total Supply",
      cell: (info) => (
        <div className={"text-sm text-gray-400"}>{info.getValue()}</div>
      )
    }),
    columnHelper.accessor("info.holderCount", {
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
