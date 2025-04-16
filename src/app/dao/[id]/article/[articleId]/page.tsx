import { formatDistanceToNow } from "date-fns"
import ArticlePreview from "~/app/dao/[id]/article/[articleId]/_components/article-preview"
import { Separator } from "~/components/ui/separator"
import type { DaoArticleDetail } from "~/server/service/dao-article"
import { api } from "~/trpc/server"

const ArticleDetailPage = async ({ params }: { params: Promise<{ id: string; articleId: string }> }) => {
  const data = await params
  const { id, articleId } = data
  const articleDetail: DaoArticleDetail = await api.daoArticle.detail({
    daoArticleId: articleId
  })
  return (
    <div className={"flex flex-col gap-4"}>
      <div className={"text-lg md:text-6xl"}>{articleDetail.title}</div>
      <Separator />
      <div className={"text-gray-400"}>Created {formatDistanceToNow(articleDetail.createdAt)}</div>
      <div className={"font-normal"}>{articleDetail.description}</div>
      <div
        className="w-1/2 max-h-52 rounded-xl bg-gray-700 bg-cover bg-center bg-no-repeat shadow lg:w-4/5"
        style={{
          backgroundImage: `url(${articleDetail.image})`,
          aspectRatio: "1 / 1"
        }}
      />
      <ArticlePreview daoId={id} id={articleId} content={articleDetail.content} />
    </div>
  )
}

export default ArticleDetailPage
