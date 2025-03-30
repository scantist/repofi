import { DaoContentType } from "@prisma/client"
import React from "react"
import ListForm from "~/app/dao/[id]/edit/list/_components/list-form"
import { Separator } from "~/components/ui/separator"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"
import type { ListRowContentParams } from "~/types/data"

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const detail: DaoDetailResult = await api.dao.detail({ daoId: id })
  const find = detail?.contents?.find((content) => content.type === "LIST_ROW")
  const isNew = find === undefined
  const data = (find ?? {
    title: "",
    sort: 0,
    type: DaoContentType.LIST_ROW,
    data: [],
    enable: true,
    id: ""
  }) as ListRowContentParams
  return (
    <div className={"space-y-6"}>
      <div>
        <h3 className="text-lg font-medium">Articles</h3>
        <p className="text-muted-foreground text-sm">Share insights via blog posts or academic publications </p>
      </div>
      <Separator />
      <ListForm id={id} isNew={isNew} data={data} />
    </div>
  )
}

export default ProfilePage
