import { redirect } from "next/navigation"

const ArticlePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  redirect(`/dao/${id}/article/new`)
}

export default ArticlePage
