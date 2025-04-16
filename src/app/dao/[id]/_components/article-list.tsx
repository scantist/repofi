import { Settings } from "lucide-react"
import { useMemo } from "react"
import ListRow from "~/app/dao/[id]/_components/list-row"
import type { ListRowContentParams, ListRowData } from "~/types/data"

interface ArticleListProps {
  data: ListRowContentParams
  isOwned: boolean
  id: string
}

const ArticleList = ({ data, isOwned, id }: ArticleListProps) => {
  const list: ListRowData[] = useMemo(() => {
    if (!data) {
      return []
    }
    return data.data
  }, [data])
  if (list.length === 0) {
    return <></>
  }
  console.log("list ----", JSON.stringify(list))
  return (
    <div className={"my-20"}>
      <div className={"text-4xl font-bold tracking-tight flex flex-row items-center gap-4"}>
        {data.title}
        {isOwned && (
          <a href={`/dao/${id}/edit/list`}>
            <Settings className={"hover:animate-spin"} />
          </a>
        )}
      </div>
      <div className={"grid grid-cols-1 gap-4 pt-10 md:grid-cols-3"}>
        {list?.map((item) => (
          <ListRow key={`article-item-${item.title}-${item.link}`} data={item} />
        ))}
      </div>
    </div>
  )
}

export default ArticleList
