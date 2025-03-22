import React from "react"
import RoadmapForm from "~/app/dao/[id]/edit/roadmap/_components/roadmap-form"
import { Separator } from "~/components/ui/separator"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return (
    <div className={"space-y-6"}>
      <div>
        <h3 className="text-lg font-medium">Roadmap</h3>
        <p className="text-muted-foreground text-sm">
          {" "}
          Define and manage your DAO's strategic milestones and future plans. A well-structured roadmap helps align your community's efforts and provides a clear vision for your
          project's development.
        </p>
      </div>
      <Separator />
      <RoadmapForm id={id} />
    </div>
  )
}

export default ProfilePage
