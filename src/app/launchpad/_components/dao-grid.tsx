"use client"
import { type FC, useMemo, useState } from "react"
import type { HomeSearchParams, Pageable } from "~/lib/schema"
import { api } from "~/trpc/react"
import DaoCard from "~/app/_components/dao-card"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "~/components/ui/pagination"

type Props = {
  initParam?: HomeSearchParams;
};

const DaoGrid: FC<Props> = ({
  initParam = {
    orderBy: "latest",
    owned: false,
    starred: false
  }
}) => {
  const [pageable, setPageable] = useState<Pageable>({
    page: 0,
    size: 6
  })
  const currentPage = useMemo(() => {
    return pageable.page + 1
  }, [pageable])
  const [param, setParam] = useState<HomeSearchParams>(initParam)
  const { data: response, isPending } = api.dao.homeSearch.useQuery({
    ...pageable,
    ...param
  })

  const totalPages = useMemo(() => {
    if (!response) {
      return 0
    }
    return response.pages
  }, [pageable])
  if (isPending) {
    return <div>Loading...</div>
  }

  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 3

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - 1 && i <= currentPage + 1) ||
        totalPages <= maxVisiblePages
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationLink
              href="#"
              isActive={i === currentPage}
              onClick={(e) => {
                e.preventDefault()
                setPageable({ ...pageable, page: i - 1 })
              }}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        )
      } else if (
        (i === currentPage - 2 && currentPage > 3) ||
        (i === currentPage + 2 && currentPage < totalPages - 2)
      ) {
        items.push(
          <PaginationItem key={i}>
            <PaginationEllipsis />
          </PaginationItem>,
        )
      }
    }

    return items
  }

  return (
    <div className={"grid grid-cols-3"}>
      {response && response?.list.length > 0 ? (
        <>
          {response?.list.map((item) => (
            <DaoCard data={item} key={`launching-dao-${item.id}`} />
          ))}
          <div className={"col-span-3 mt-6"}>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) {
                        setPageable({ ...pageable, page: currentPage - 2 })
                      }
                    }}
                  />
                </PaginationItem>
                {renderPaginationItems()}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) {
                        setPageable({ ...pageable, page: currentPage })
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </>
      ) : (
        <div>No Data</div>
      )}
    </div>
  )
}

export default DaoGrid
