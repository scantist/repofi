import { redirect } from "next/navigation"

const EditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  redirect(`/dao/${id}/edit/profile`)
}

export default EditPage
