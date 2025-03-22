import React from "react"
import TeamForm from "~/app/dao/[id]/edit/team/_components/team-form"
import { Separator } from "~/components/ui/separator"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"

const ProfilePage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  return (
    <div className={"space-y-6"}>
      <div>
        <h3 className="text-lg font-medium">Team & Community</h3>
        <p className="text-muted-foreground text-sm">Show off your team & community, everyone can get to know you better.</p>
      </div>
      <Separator />
      <TeamForm id={id} />
    </div>
  )
}

export default ProfilePage
