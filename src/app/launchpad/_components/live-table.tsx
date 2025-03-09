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

interface Condition {
  pagination: PaginationState;
}

const LiveTable = () => {
  const columnHelper = createColumnHelper<DaoPage>()
  const [condition, setCondition] = useState<Condition>({
    pagination: {
      pageSize: 10,
      pageIndex: 0
    }
  })
  const [data] = useState<DaoPage[]>([])
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
      data={{
        list: [],
        total: 0
      }}
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
