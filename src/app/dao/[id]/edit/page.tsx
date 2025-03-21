import { redirect } from "next/navigation"

const EditPage = async ({ params }: { params: { id: string } }) => {
  redirect(`/dao/${params.id}/edit/profile`)
}

export default EditPage
