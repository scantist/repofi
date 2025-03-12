"use client"

import React, { Fragment, useState } from "react"
import { createColumnHelper, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { cn } from "~/lib/utils"
import CardWrapper from "~/components/card-wrapper"
import { Button } from "~/components/ui/button"

interface Dao {
  name: string;
  amount: string;
  vAmount: string;
  price: string;
  total: string;
}
const columnHelper = createColumnHelper<Dao>()

const PortfolioTable = () => {
  const [data] = useState<Dao[]>([
    {
      name: "UNI DAO",
      amount: "12.5M",
      vAmount: "5.2M",
      price: "$5.23",
      total: "$65.3M"
    },
    {
      name: "AAVE",
      amount: "8.9M",
      vAmount: "3.8M",
      price: "$62.15",
      total: "$236.17M"
    },
    {
      name: "Compound",
      amount: "5.6M",
      vAmount: "2.1M",
      price: "$45.32",
      total: "$95.17M"
    },
    {
      name: "MakerDAO",
      amount: "15.6M",
      vAmount: "6.8M",
      price: "$896.45",
      total: "$6,095.86M"
    },
    {
      name: "PancakeSwap",
      amount: "25.6M",
      vAmount: "12.3M",
      price: "$1.85",
      total: "$22.75M"
    },
    {
      name: "Curve DAO",
      amount: "9.8M",
      vAmount: "4.5M",
      price: "$0.52",
      total: "$2.34M"
    },
    {
      name: "SushiSwap",
      amount: "7.5M",
      vAmount: "3.2M",
      price: "$1.12",
      total: "$3.58M"
    },
    {
      name: "Raydium",
      amount: "4.5M",
      vAmount: "1.8M",
      price: "$0.25",
      total: "$0.45M"
    },
    {
      name: "Trader Joe",
      amount: "3.2M",
      vAmount: "1.5M",
      price: "$0.85",
      total: "$1.27M"
    },
    {
      name: "OlympusDAO",
      amount: "2.8M",
      vAmount: "1.2M",
      price: "$12.35",
      total: "$14.82M"
    }
  ])
  const columns = [
    columnHelper.accessor("name", {
      header: () => "BioDAO",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("amount", {
      header: () => "Amount",
      cell: (info) => <div>{info.getValue()}</div>
    }),
    columnHelper.accessor("vAmount", {
      header: () => "vAmount",
      cell: (info) => <div>{info.getValue()}</div>
    }),
    columnHelper.accessor("price", {
      header: () => "Price",
      cell: (info) => <div className={"text-gray-400 text-sm"}>${info.getValue()}</div>
    }),
    columnHelper.accessor("total", {
      header: () => "Total Value",
      cell: (info) => <div className={"text-gray-400 text-sm"}>${info.getValue()}</div>
    }),
    columnHelper.accessor("name", {
      id: "action",
      header: () => "Action",
      cell: () => <Button variant={"outline"}>Buy</Button>
    })
  ]
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  })
  return <CardWrapper borderClassName={"w-full"} contentClassName={"bg-card"}>
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
              <th
                key={header.id}
                className={"bg-secondary nth-[1]:pl-4 nth-last-[1]:pr-4"}
                style={{ textAlign: "left" }}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody className={""}>
        {table.getRowModel().rows.map((row) => (
          <Fragment key={row.id}>
            <tr
              className={cn(
                "h-16 border-t-1 border-white/20",
                row.getIsExpanded() && "bg-[#6A21F74D]",
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className={"nth-[1]:pl-4 nth-last-[1]:pr-4"}
                >
                  {flexRender(
                    cell.column.columnDef.cell,
                    cell.getContext(),
                  )}
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
              <th key={header.id}>
                {header.isPlaceholder
                  ? null
                  : flexRender(
                    header.column.columnDef.footer,
                    header.getContext(),
                  )}
              </th>
            ))}
          </tr>
        ))}
        </tfoot>
      </table>
    </div>
  </CardWrapper>
}
export default PortfolioTable
