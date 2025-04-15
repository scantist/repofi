import type React from "react"
import CardWrapper from "~/components/card-wrapper"
import { compareStringToUpperCase } from "~/lib/utils"
import { auth } from "~/server/auth"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"
import { DaoProvider } from "../context"

const ArticleLayout = async ({
  params,
  children
}: {
  params: Promise<{ id: string }>
  children: React.ReactNode
}) => {
  const { id } = await params
  const daoDetail: DaoDetailResult = await api.dao.detail({ daoId: id })
  const session = await auth()
  if (daoDetail === null) {
    return <div>No Data</div>
  }
  const isOwned = compareStringToUpperCase(daoDetail?.createdBy, session?.address)
  return (
    <DaoProvider initialDetail={daoDetail}>
      <div className={"mt-16 min-h-full"}>
        <CardWrapper className={"mx-4 flex max-w-7xl md:mx-auto my-10 min-h-full"} contentClassName={"w-full space-y-6 p-10 pb-16 md:block min-h-full"}>
          {children}
        </CardWrapper>
      </div>
    </DaoProvider>
  )
}
export default ArticleLayout
