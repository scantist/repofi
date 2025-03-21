
import { Separator } from "~/components/ui/separator"
import React from "react"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"
import BaseForm from "~/app/dao/[id]/edit/base/_components/base-form"

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const daoDetail: DaoDetailResult = await api.dao.detail({ daoId: id })
  if (daoDetail === null) {
    return <div>No Data</div>
  }
  return (
    <div className={"space-y-6"}>
      <div>
        <h3 className="text-lg font-medium">Base</h3>
        <p className="text-muted-foreground text-sm">This is how others will see your DAO on the site.</p>
      </div>
      <Separator />
      <BaseForm dao={daoDetail} />
    </div>
  )
}

export default ProfilePage
