import { useMemo } from "react"
import ListRow from "~/app/dao/[id]/_components/list-row"
import CardWrapper from "~/components/card-wrapper"
import type { ListRowContentParams, ListRowData } from "~/types/data"

interface ArticleListProps {
  data: ListRowContentParams
}

const ArticleList = ({ data }: ArticleListProps) => {
  const list: ListRowData[] = useMemo(() => {
    if (!data) {
      return []
    }
    return data.data
  }, [data])
  if (list.length === 0) {
    return <></>
  }
  return (
    <div className={"my-20"}>
      <div className={"text-4xl font-bold tracking-tight"}>{data.title}</div>
      <div className={"grid grid-cols-1 gap-4 pt-10 md:grid-cols-3"}>
        {list.map((item) => (
          <ListRow key={`article-item-${item.title}-${item.link}`} data={item} />
        ))}
      </div>
    </div>
  )
}

export default ArticleList
