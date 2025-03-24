"use client"

import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import React, { Fragment, useState } from "react"
import CardWrapper from "~/components/card-wrapper"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import type { DaoSearchResult } from "~/server/service/dao"
import { api } from "~/trpc/react"

interface Dao {
  name: string
  amount: string
  vAmount: string
  price: string
  total: string
}
const columnHelper = createColumnHelper<DaoSearchResult["list"][number]>()

interface PortfolioTableProps {
  daoList: DaoSearchResult
}

const PortfolioTable = ({ daoList }: PortfolioTableProps) => {
  const { data: response, isPending } = api.dao.search.useQuery(
    {
      status: ["LAUNCHED"]
    },
    {
      initialData: daoList
    }
  )
  const router = useRouter()
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
      cell: (info) => <div className={"text-sm text-gray-400"}>${info.getValue()}</div>
    }),
    columnHelper.accessor("tokenInfo.marketCap", {
      header: () => "Market Cap",
      cell: (info) => <div className={"text-sm text-gray-400"}>${info.getValue()}</div>
    }),
    columnHelper.accessor("tokenInfo.totalSupply", {
      header: () => "Total Supply",
      cell: (info) => <div className={"text-sm text-gray-400"}>{info.getValue()}</div>
    }),
    columnHelper.accessor("tokenInfo.holderCount", {
      header: () => "Holder Count",
      cell: (info) => <div className={"text-sm text-gray-400"}>{info.getValue()}</div>
    }),
    columnHelper.accessor("id", {
      id: "action",
      header: () => "Action",
      cell: (info) => (
        <Button
          variant={"outline"}
          onClick={() => {
            router.push(`/dao/${info.getValue()}`)
          }}
        >
          Buy
        </Button>
      )
    })
  ]
  const table = useReactTable({
    data: response?.list ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  })
  return (
    <CardWrapper borderClassName={"w-full"}>
      <div className={"-mt-1 -ml-1 rounded-lg"}>
        <table
          className={"overflow-hidden rounded-lg"}
          style={{
            width: "calc(100% + 2px)"
          }}
        >
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className={"h-16"} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className={"bg-secondary nth-[1]:pl-4 nth-last-[1]:pr-4"} style={{ textAlign: "left" }}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={""}>
            {table.getRowModel().rows.map((row) => (
              <Fragment key={row.id}>
                <tr className={cn("h-16 border-t-1 border-white/20", row.getIsExpanded() && "bg-[#6A21F74D]")}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className={"nth-[1]:pl-4 nth-last-[1]:pr-4"}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              </Fragment>
            ))}
          </tbody>
          <tfoot>
            {table.getFooterGroups().map((footerGroup) => (
              <tr key={footerGroup.id}>
                {footerGroup.headers.map((header) => (
                  <th key={header.id}>{header.isPlaceholder ? null : flexRender(header.column.columnDef.footer, header.getContext())}</th>
                ))}
              </tr>
            ))}
          </tfoot>
        </table>
      </div>
    </CardWrapper>
  )
}
export default PortfolioTable
