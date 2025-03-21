import { type ColumnDef, flexRender, getCoreRowModel, getExpandedRowModel, type PaginationState, type Row, useReactTable } from "@tanstack/react-table"
import { Fragment, type ReactNode, useEffect, useMemo, useState } from "react"
import { cn } from "~/lib/utils"
import CardWrapper from "~/components/card-wrapper"
import { type PageableData } from "~/types/data"
import NoData from "~/components/no-data"

interface Props<T> {
  data?: PageableData<T>
  // eslint-disable-next-line
  columns: ColumnDef<T, any>[]
  loading?: boolean
  onPaginationChange: (pagination: PaginationState) => void
  outPagination: PaginationState
  onRowClick?: (row: Row<T>) => void
  getRowCanExpand?: (row: Row<T>) => boolean
  expendRow?: (row: Row<T>) => ReactNode
  pageSize?: number[]
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
  pageSize = [10, 20, 50, 100]
}: Props<T>) => {
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
                  Data Loading...
                </td>
              </tr>
            ) : data && data.list.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <Fragment key={row.id}>
                  <tr
                    className={cn("h-16 border-t-1 border-white/20", row.getIsExpanded() && "bg-[#6A21F74D]")}
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
                  <NoData size={96} className={"col-span-1 my-20 sm:col-span-2 lg:col-span-3"} />
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
      </div>
    </CardWrapper>
  )
}

export default DataTable
