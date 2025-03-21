import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/server"
import Banner from "~/app/dao/[id]/_components/banner"
import React from "react"
import CardWrapper from "~/components/card-wrapper"

const EditLayout = async ({
  params,
  children
}: {
  params: Promise<{ id: string }>;
  children: React.ReactNode;
}) => {
  const { id } = await params
  const daoDetail: DaoDetailResult = await api.dao.detail({ daoId: id })
  if (daoDetail === null) {
    return <div>No Data</div>
  }
  return (
    <div className={"mt-20 min-h-full"}>
      <Banner id={id} daoDetail={daoDetail} />
      <CardWrapper
        className={"mx-4 flex max-w-7xl md:mx-auto my-10"}
        contentClassName={"w-full space-y-6 p-10 pb-16 md:block"}
      >
        <div className="space-y-0.5">
          <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
          <p className="text-muted-foreground">
            Manage your DAO settings and config content!
          </p>
        </div>
        <div
          className={
            "flex w-full flex-col space-y-8 lg:flex-row lg:space-y-0 lg:space-x-12"
          }
        >
          <aside className="lg:w-1/5">
            <nav className="flex space-x-2 lg:flex-col lg:space-y-1 lg:space-x-0">
              <a
                className="focus-visible:ring-ring hover:text-accent-foreground bg-muted hover:bg-muted inline-flex h-9 items-center justify-start gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                href="/examples/forms"
              >
                Profile
              </a>
              <a
                className="focus-visible:ring-ring hover:text-accent-foreground inline-flex h-9 items-center justify-start gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-transparent hover:underline focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                href="/examples/forms/account"
              >
                Account
              </a>
              <a
                className="focus-visible:ring-ring hover:text-accent-foreground inline-flex h-9 items-center justify-start gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-transparent hover:underline focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                href="/examples/forms/appearance"
              >
                Appearance
              </a>
              <a
                className="focus-visible:ring-ring hover:text-accent-foreground inline-flex h-9 items-center justify-start gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-transparent hover:underline focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                href="/examples/forms/notifications"
              >
                Notifications
              </a>
              <a
                className="focus-visible:ring-ring hover:text-accent-foreground inline-flex h-9 items-center justify-start gap-2 rounded-md px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors hover:bg-transparent hover:underline focus-visible:ring-1 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                href="/examples/forms/display"
              >
                Display
              </a>
            </nav>
          </aside>
          <div className="flex-1">{children}</div>
        </div>
      </CardWrapper>
    </div>
  )
}

export default EditLayout
