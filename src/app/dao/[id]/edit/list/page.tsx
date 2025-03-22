import React from "react"
import ListForm from "~/app/dao/[id]/edit/list/_components/list-form"
import { Separator } from "~/components/ui/separator"

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return (
    <div className={"space-y-6"}>
      <div>
        <h3 className="text-lg font-medium">Article</h3>
        <p className="text-muted-foreground text-sm">Edit your most popular articles for display！</p>
      </div>
      <Separator />
      <ListForm id={id} />
    </div>
  )
}

export default ProfilePage
