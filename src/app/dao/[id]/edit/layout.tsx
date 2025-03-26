import type React from "react"
import Banner from "~/app/dao/[id]/_components/banner"
import DaoSide from "~/app/dao/[id]/_components/dao-side"
import CardWrapper from "~/components/card-wrapper"
import { Separator } from "~/components/ui/separator"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"
import Link from "next/link";

const EditLayout = async ({
  params,
  children
}: {
  params: Promise<{ id: string }>
  children: React.ReactNode
}) => {
  const { id } = await params
  const daoDetail: DaoDetailResult = await api.dao.detail({ daoId: id })
  if (daoDetail === null) {
    return <div>No Data</div>
  }
  return (
    <div className={"mt-20 min-h-full"}>
      <Banner id={id} daoDetail={daoDetail} />
      <CardWrapper className={"mx-4 flex max-w-7xl md:mx-auto my-10"} contentClassName={"w-full space-y-6 p-10 pb-16 md:block"}>
        <div className="flex justify-between items-center">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">Manage your DAO settings and config content!</p>
          </div>
          <Link
            href={`/dao/${id}`}
            className="px-4 py-2  text-white rounded  transition-colors"
          >
            Exit
          </Link>
        </div>
        <Separator />
        <div className={"flex w-full flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12"}>
          <DaoSide id={id} />
          <div className="flex-1">{children}</div>
        </div>
      </CardWrapper>
    </div>
  )
}

export default EditLayout
