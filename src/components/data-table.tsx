"use client"
import { type ColumnDef, type PaginationState, type Row, flexRender, getCoreRowModel, getExpandedRowModel, useReactTable } from "@tanstack/react-table"
import { useRouter } from "next/navigation"
import React, { Fragment, type ReactNode, useEffect, useMemo, useState } from "react"
import LoadingSpinner from "~/app/_components/loading-spinner"
import CardWrapper from "~/components/card-wrapper"
import NoData from "~/components/no-data"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import type { PageableData } from "~/types/data"

interface Props<T> {
  data?: PageableData<T>
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  columns: ColumnDef<T, any>[]
  loading?: boolean
  onPaginationChange: (pagination: PaginationState) => void
  outPagination: PaginationState
  onRowClick?: (row: Row<T>) => void
  getRowCanExpand?: (row: Row<T>) => boolean
  expendRow?: (row: Row<T>) => ReactNode
  pageSize?: number[]
  children?: ReactNode
}

const DataTable = <T,>({
  data,
  columns,
  outPagination,
  loading,
  onRowClick,
  onPaginationChange,
  getRowCanExpand = () => false,
  expendRow,
  pageSize = [10, 20, 50, 100],
  children
}: Props<T>) => {
  const router = useRouter()
  const [pagination, setPagination] = useState<PaginationState>(outPagination)
  const table = useReactTable({
    data: data?.list ?? [],
    state: {
      pagination
    },
    columns,
    rowCount: data?.total,
    getCoreRowModel: getCoreRowModel(),
    getRowCanExpand,
    onPaginationChange: setPagination,
    getExpandedRowModel: getExpandedRowModel(),
    debugTable: true,
    manualPagination: true
  })
  const pageCount = useMemo(() => {
    return Math.ceil((data?.total ?? 0) / pagination.pageSize)
  }, [data, pagination])
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    onPaginationChange(pagination)
  }, [pagination])
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
            {loading ? (
              <tr>
                <td className="px-6 py-4" colSpan={columns.length}>
                  <LoadingSpinner size={64} className="my-8" text="Loading dao..." />
                </td>
              </tr>
            ) : data && data.list.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <tr
                    className={cn(
                      "h-16 border-t-1 border-white/20 transition",
                      row.getIsExpanded() && "bg-[#6A21F74D]",
                      (row.getCanExpand() || onRowClick) && "cursor-pointer hover:bg-[#6A21F74D]"
                    )}
                    onClick={() => {
                      onRowClick?.(row)
                      // if (row.getCanExpand()) {
                      //   row.getToggleExpandedHandler()()
                      // }
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className={"nth-[1]:pl-4 nth-last-[1]:pr-4"}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                  {row.getIsExpanded() && expendRow?.(row)}
                </Fragment>
              ))
            ) : (
              <tr>
                <td className="px-6 py-4" colSpan={columns.length}>
                  <NoData
                    size={96}
                    className={"col-span-1 my-20 sm:col-span-2 lg:col-span-3"}
                    text={
                      <div className={"space-y-4 text-center"}>
                        <div>There are no DAOs of which you have owned any shares yet. </div>
                        <Button className={"w-auto"} onClick={() => router.push("/")}>
                          Explore and invest in DAO
                        </Button>
                      </div>
                    }
                  />
                </td>
              </tr>
            )}
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
        {children}
      </div>
    </CardWrapper>
  )
}

export default DataTable
