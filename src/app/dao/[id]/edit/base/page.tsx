import React, { useMemo } from "react"
import BaseForm from "~/app/dao/[id]/edit/base/_components/base-form"
import { Separator } from "~/components/ui/separator"
import type { DaoLinks } from "~/lib/schema"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const detail: DaoDetailResult = await api.dao.detail({ daoId: id })
  const daoLinks = detail.links as DaoLinks
  const links = {
    x: daoLinks.find((item) => item.type === "x")?.value,
    telegram: daoLinks.find((item) => item.type === "telegram")?.value,
    discord: daoLinks.find((item) => item.type === "discord")?.value,
    website: daoLinks.find((item) => item.type === "website")?.value
  }
  console.log("links", detail, links)
  return (
    <div className={"space-y-6"}>
      <div>
        <h3 className="text-lg font-medium">Basic Info</h3>
        <p className="text-muted-foreground text-sm">Basic Information for your DAO</p>
      </div>
      <Separator />
      <BaseForm
        dao={{
          ...detail,
          daoId: id,
          ...links
        }}
        {...detail}
      />
    </div>
  )
}

export default ProfilePage
