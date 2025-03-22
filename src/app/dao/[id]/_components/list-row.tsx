import { Trash2 } from "lucide-react"
import CardWrapper from "~/components/card-wrapper"
import { cn } from "~/lib/utils"
import type { ListRowData } from "~/types/data"

const ListRow = ({ data, className, onDelete }: { data: ListRowData; className?: string; onDelete?: () => void }) => {
  return (
    <CardWrapper className={"col-span-1 sm:col-span-2 md:col-span-1 "} contentClassName={cn("h-full", className)}>
      <img alt={data.title} src={data.image} className="w-full max-h-52 object-cover rounded-t-lg aspect-square" />
      <div className={"mx-6 mt-4 flex flex-col gap-4 rounded-lg pb-4"}>
        <div className={"text-xl font-bold truncate"}>{data.title}</div>
        <div className={"text-xs text-gray-500 line-clamp-5 h-[5em] text-ellipsis"}>{data.description}</div>
        <div className={"flex justify-end"}>
          <a target="_blank" rel={"noreferrer"} href={data.link} className={"border-primary text-xs left-0 max-w-max rounded-lg border px-2 py-1"}>
            Read More
          </a>
          {onDelete && (
            <button type={"button"} onClick={onDelete} className="text-red-500 hover:text-red-700 ml-4">
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

export default ListRow
