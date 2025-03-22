import React from "react"
import BaseForm from "~/app/dao/[id]/edit/base/_components/base-form"
import { Separator } from "~/components/ui/separator"

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return (
    <div className={"space-y-6"}>
      <div>
        <h3 className="text-lg font-medium">Base</h3>
        <p className="text-muted-foreground text-sm">This is how others will see your DAO on the site.</p>
      </div>
      <Separator />
      <BaseForm id={id} />
    </div>
  )
}

export default ProfilePage
