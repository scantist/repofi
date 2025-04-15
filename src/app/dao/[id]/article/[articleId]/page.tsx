import { formatDistanceToNow } from "date-fns"
import ArticlePreview from "~/app/dao/[id]/article/[articleId]/_components/article-preview"
import { Separator } from "~/components/ui/separator"
import { api } from "~/trpc/server"

const ArticleDetailPage = async ({ params }: { params: Promise<{ id: string; articleId: string }> }) => {
  const data = await params
  const { id, articleId } = data
  const articleDetail = await api.daoArticle.detail({
    daoArticleId: articleId
  })
  console.log(data)
  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"text-lg md:text-2xl"}>{articleDetail.title}</div>
      <div className={"text-gray-400"}>{formatDistanceToNow(articleDetail.createdAt)}</div>
      <Separator />
      <ArticlePreview daoId={id} id={articleId} content={articleDetail.content} />
    </div>
  )
}

export default ArticleDetailPage
