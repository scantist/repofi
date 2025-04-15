import "vditor/dist/index.css"
import ArticleEdit from "~/app/dao/[id]/article/[articleId]/edit/_components/article-edit"
import type { DaoArticleDetail } from "~/server/service/dao-article"
import { api } from "~/trpc/server"

const NewArticlePage = async ({ params }: { params: Promise<{ id: string; articleId: string }> }) => {
  const { id, articleId } = await params
  console.log({ id, articleId })
  const detail: DaoArticleDetail = await api.daoArticle.detail({ daoArticleId: articleId })
  return (
    <div className={" space-y-8 min-h-full relative"}>
      <ArticleEdit id={id} articleId={articleId} detail={detail} />
    </div>
  )
}

export default NewArticlePage
