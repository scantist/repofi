"use client"

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable
} from "@tanstack/react-table"
import React, { Fragment, useState } from "react"
import { cn } from "~/lib/utils"
import CardWrapper from "~/components/card-wrapper"

interface Dao {
  id: string;
  name: string;
  chain: string;
  price: string;
  volumeDay: string;
  holderCount: string;
  marketCap: string;
}

const LiveTable = () => {
  const columnHelper = createColumnHelper<Dao>()
  const [data] = useState<Dao[]>( [
    {
      id: "1",
      name: "UNI DAO",
      chain: "Ethereum",
      price: "5.23",
      volumeDay: "12.5M",
      holderCount: "0.28M",
      marketCap: "3,950M"
    },
    {
      id: "2",
      name: "AAVE",
      chain: "Ethereum",
      price: "62.15",
      volumeDay: "8.9M",
      holderCount: "0.125M",
      marketCap: "890M"
    },
    {
      id: "3",
      name: "Compound",
      chain: "Ethereum",
      price: "45.32",
      volumeDay: "5.6M",
      holderCount: "0.098M",
      marketCap: "450M"
    },
    {
      id: "4",
      name: "MakerDAO",
      chain: "Ethereum",
      price: "896.45",
      volumeDay: "15.6M",
      holderCount: "0.089M",
      marketCap: "2,300M"
    },
    {
      id: "5",
      name: "PancakeSwap",
      chain: "BSC",
      price: "1.85",
      volumeDay: "25.6M",
      holderCount: "0.458M",
      marketCap: "580M"
    },
    {
      id: "6",
      name: "Curve DAO",
      chain: "Ethereum",
      price: "0.52",
      volumeDay: "9.8M",
      holderCount: "0.156M",
      marketCap: "280M"
    },
    {
      id: "7",
      name: "SushiSwap",
      chain: "Ethereum",
      price: "1.12",
      volumeDay: "7.5M",
      holderCount: "0.145M",
      marketCap: "320M"
    },
    {
      id: "8",
      name: "Raydium",
      chain: "Solana",
      price: "0.25",
      volumeDay: "4.5M",
      holderCount: "0.089M",
      marketCap: "150M"
    },
    {
      id: "9",
      name: "Trader Joe",
      chain: "Avalanche",
      price: "0.85",
      volumeDay: "3.2M",
      holderCount: "0.065M",
      marketCap: "120M"
    },
    {
      id: "10",
      name: "OlympusDAO",
      chain: "Ethereum",
      price: "12.35",
      volumeDay: "2.8M",
      holderCount: "0.045M",
      marketCap: "180M"
    }
  ])
  const columns = [
    columnHelper.accessor("id", {
      header: () => "#",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("name", {
      header: () => "BioDAO",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("chain", {
      header: () => "Chain",
      cell: (info) => <div>{info.getValue()}</div>
    }),
    columnHelper.accessor("price", {
      header: () => "Price",
      cell: (info) => <div className={"text-gray-400 text-sm"}>${info.getValue()}</div>
    }),
    columnHelper.accessor("volumeDay", {
      header: () => "Volume 24",
      cell: (info) => <div className={"text-gray-400 text-sm"}>${info.getValue()}</div>
    }),
    columnHelper.accessor("holderCount", {
      header: () => "Holder Count",
      cell: (info) => <div className={"text-gray-400 text-sm"}>{info.getValue()}</div>
    }),
    columnHelper.accessor("marketCap", {
      header: () => "7d Market Cap",
      cell: (info) => <div className={"text-gray-400 text-sm"}>{info.getValue()}</div>
    })
  ]
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    debugTable: true
  })
  return <CardWrapper borderClassName={"w-full"}>
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

export default LiveTable
