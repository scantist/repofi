import { DaoContentType } from "@prisma/client"
import React from "react"
import InformationForm from "~/app/dao/[id]/edit/information/_components/information-form"
import { Separator } from "~/components/ui/separator"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"
import type { InformationContentParams } from "~/types/data"

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const detail: DaoDetailResult = await api.dao.detail({ daoId: id })
  const find = detail?.contents?.find((content) => content.type === "INFORMATION")
  const isNew = find === undefined
  const data =
    find ??
    ({
      title: "",
      sort: 0,
      type: DaoContentType.INFORMATION,
      data: {
        information: "",
        image: ""
      },
      enable: true,
      id: ""
    } as InformationContentParams)
  return (
    <div className={"space-y-6"}>
      <div>
        <h3 className="text-lg font-medium">Base</h3>
        <p className="text-muted-foreground text-sm">This is how others will see your DAO on the site.</p>
      </div>
      <Separator />
      <InformationForm id={id} isNew={isNew} data={data} />
    </div>
  )
}

export default ProfilePage
