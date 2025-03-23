import React from "react"
import InformationForm from "~/app/dao/[id]/edit/information/_components/information-form"
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
      <InformationForm id={id} />
    </div>
  )
}

export default ProfilePage
