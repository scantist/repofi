import type { FC } from "react"
import type { ListRowData } from "~/types/data"

interface ListContentProps {
  data: ListRowData[]
}

const ListContent: FC<ListContentProps> = ({ data }) => {
  return <div className={"grid grid-cols-1 gap-8 pt-10 sm:grid-cols-4 md:grid-cols-3"}></div>
}

export default ListContent
