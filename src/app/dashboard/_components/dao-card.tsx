"use client"

import CardWrapper from "~/components/card-wrapper"
import {
  createColumnHelper,
  type ExpandedState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  useReactTable
} from "@tanstack/react-table"

import React, { Fragment, useState } from "react"
import ExpandContent from "~/app/dashboard/_components/expand-content"
import { cn } from "~/lib/utils"
import { ChevronUp } from "lucide-react"

interface Dao {
  id: string;
  name: string;
  price: string;
  coefficient: string;
  deployed: string;
  tokenized: string;
  total: string;
  community: string;
}

const DaoCard = () => {
  const columnHelper = createColumnHelper<Dao>()
  const [data] = useState<Dao[]>([
    {
      id: "1",
      name: "Genesis DAO",
      price: "0.85",
      coefficient: "1.2",
      deployed: "2023-01-15",
      tokenized: "YES",
      total: "1000000",
      community: "Ethereum"
    },
    {
      id: "2",
      name: "Alpha DAO",
      price: "1.25",
      coefficient: "0.9",
      deployed: "2023-02-20",
      tokenized: "NO",
      total: "500000",
      community: "Polygon"
    },
    {
      id: "3",
      name: "Beta DAO",
      price: "2.10",
      coefficient: "1.5",
      deployed: "2023-03-10",
      tokenized: "YES",
      total: "750000",
      community: "BSC"
    },
    {
      id: "4",
      name: "Gamma DAO",
      price: "0.95",
      coefficient: "1.1",
      deployed: "2023-04-05",
      tokenized: "YES",
      total: "250000",
      community: "Solana"
    },
    {
      id: "5",
      name: "Delta DAO",
      price: "1.75",
      coefficient: "1.3",
      deployed: "2023-05-12",
      tokenized: "NO",
      total: "900000",
      community: "Avalanche"
    },
    {
      id: "6",
      name: "Epsilon DAO",
      price: "3.20",
      coefficient: "1.8",
      deployed: "2023-06-18",
      tokenized: "YES",
      total: "600000",
      community: "Cardano"
    },
    {
      id: "7",
      name: "Zeta DAO",
      price: "0.65",
      coefficient: "0.8",
      deployed: "2023-07-22",
      tokenized: "YES",
      total: "450000",
      community: "Ethereum"
    },
    {
      id: "8",
      name: "Eta DAO",
      price: "1.45",
      coefficient: "1.4",
      deployed: "2023-08-30",
      tokenized: "NO",
      total: "800000",
      community: "Polygon"
    },
    {
      id: "9",
      name: "Theta DAO",
      price: "2.85",
      coefficient: "1.6",
      deployed: "2023-09-14",
      tokenized: "YES",
      total: "350000",
      community: "BSC"
    },
    {
      id: "10",
      name: "Iota DAO",
      price: "1.95",
      coefficient: "1.7",
      deployed: "2023-10-01",
      tokenized: "YES",
      total: "550000",
      community: "Solana"
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
    columnHelper.accessor("price", {
      header: () => "Price",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("coefficient", {
      header: () => "Funding Coefficient",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("deployed", {
      header: () => "Funds Deployed",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("tokenized", {
      header: () => "Tokenized IP Value",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("total", {
      header: () => "Total IP-NFTs",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("community", {
      header: () => "community",
      cell: (info) => info.getValue()
    }),
    columnHelper.accessor("id", {
      header: () => "",
      id: "actions",
      cell: ({ row }) => (
        <ChevronUp
          onClick={row.getToggleExpandedHandler()}
          className={cn(
            "rotate-0 transform cursor-pointer transition-all duration-150 ease-in-out",
            row.getIsExpanded() && "rotate-180"
          )}
        />
      )
    })
  ]

  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const table = useReactTable({
    data,
    columns,
    state: {
      expanded
    },
    getRowCanExpand: () => true,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true
  })
  return (
    <CardWrapper borderClassName={""}>
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
                {row.getIsExpanded() && (
                  <tr className={"bg-[#6A21F74D]"}>
                    <td colSpan={row.getVisibleCells().length}>
                      <ExpandContent />
                    </td>
                  </tr>
                )}
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
  )
}

export default DaoCard
