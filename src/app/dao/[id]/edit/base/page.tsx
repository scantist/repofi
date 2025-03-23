import React from "react"
import BaseForm from "~/app/dao/[id]/edit/base/_components/base-form"
import { Separator } from "~/components/ui/separator"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const detail: DaoDetailResult = await api.dao.detail({ daoId: id })
  return (
    <div className={"space-y-6"}>
      <div>
        <h3 className="text-lg font-medium">Base</h3>
        <p className="text-muted-foreground text-sm">This is how others will see your DAO on the site.</p>
      </div>
      <Separator />
      <BaseForm
        dao={{
          ...detail,
          daoId: id
        }}
        {...detail}
      />
    </div>
  )
}

export default ProfilePage
