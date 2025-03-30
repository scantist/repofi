import { DaoContentType } from "@prisma/client"
import React from "react"
import TeamForm from "~/app/dao/[id]/edit/team/_components/team-form"
import { Separator } from "~/components/ui/separator"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"
import type { RoadmapContentParams, TeamContentParams } from "~/types/data"

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const detail: DaoDetailResult = await api.dao.detail({ daoId: id })
  const find = detail?.contents?.find((content) => content.type === "TEAM_COMMUNITY")
  const isNew = find === undefined
  const data = (find ?? {
    title: "",
    sort: 0,
    type: DaoContentType.TEAM_COMMUNITY,
    data: [],
    enable: true,
    id: ""
  }) as TeamContentParams
  return (
    <div className={"space-y-6"}>
      <div>
        <h3 className="text-lg font-medium">Team & Community</h3>
        <p className="text-muted-foreground text-sm">Show off your team & community</p>
      </div>
      <Separator />
      <TeamForm id={id} isNew={isNew} data={data} />
    </div>
  )
}

export default ProfilePage
