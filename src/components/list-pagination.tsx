import { type Pageable } from "~/lib/schema"
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "./ui/pagination"
import { type FC, useMemo } from "react"

type Props = {
  pageable: Pageable
  totalPages: number
  setPageable: (pageable: Pageable) => void
}

const ListPagination: FC<Props> = ({ pageable, totalPages, setPageable }) => {
  const currentPage = useMemo(() => {
    return pageable.page + 1
  }, [pageable])
  const items = []
  const maxVisiblePages = 3

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || (i >= Math.max(1, currentPage - 1) && i <= Math.min(totalPages, currentPage + 1)) || totalPages <= maxVisiblePages) {
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
        </PaginationItem>
      )
    } else if ((i === currentPage - 2 && currentPage > 3) || (i === currentPage + 2 && currentPage < totalPages - 2)) {
      items.push(
        <PaginationItem key={i}>
          <PaginationEllipsis />
        </PaginationItem>
      )
    }
  }
  return (
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
        {items}
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
  )
}

export default ListPagination
