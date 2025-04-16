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
      <Separator />
      <div>{/*  TODO Add description*/}</div>
      <div className={"text-gray-400"}>{formatDistanceToNow(articleDetail.createdAt)}</div>
      <div
        className="w-1/2 max-h-52 rounded-xl bg-gray-700 bg-cover bg-center bg-no-repeat shadow lg:w-4/5"
        style={{
          backgroundImage: "url(https://storage.googleapis.com/repofi/launchpad/avatar/1744559919089_1.png})",
          aspectRatio: "1 / 1"
        }}
      />
      <div className={"text-xl"}>Content</div>
      <ArticlePreview daoId={id} id={articleId} content={articleDetail.content} />
    </div>
  )
}

export default ArticleDetailPage
