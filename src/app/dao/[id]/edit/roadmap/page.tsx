
import { Separator } from "~/components/ui/separator"
import React from "react"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"
import RoadmapForm from "~/app/dao/[id]/edit/roadmap/_components/roadmap-form"

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const daoDetail: DaoDetailResult = await api.dao.detail({ daoId: id })
  if (daoDetail === null) {
    return <div>No Data</div>
  }
  return (
    <div className={"space-y-6"}>
      <div>
        <h3 className="text-lg font-medium">Roadmap</h3>
        <p className="text-muted-foreground text-sm"> Define and manage your DAO's strategic milestones and future plans. A well-structured roadmap helps align your community's efforts and provides a clear vision for your project's development.</p>
      </div>
      <Separator />
      <RoadmapForm dao={daoDetail} />
    </div>
  )
}

export default ProfilePage
