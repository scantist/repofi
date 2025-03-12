"use client"

import CardWrapper from "~/components/card-wrapper"
import { useState } from "react"
import { cn } from "~/lib/utils"
import DaoGrid from "./dao-grid"
import LiveTable from "~/app/_components/live-table"

const LiveDao = () => {
  const [type, setType] = useState<"DISCOVER" | "ANALYTICS">("DISCOVER")
  return (
    <div
      className={
        "mx-auto flex min-h-full w-full max-w-7xl flex-col gap-8 px-4 pt-10 pb-10"
      }
    >
      <div className={"text-4xl font-bold"}>Live DAOs</div>
      <CardWrapper contentClassName={"bg-card"}>
        <div className={"p-4 text-sm font-thin"}>
          Join DeSci by participating in the early stage funding of new BioDAOs.
          Your participation fuels cutting-edge research, open collaboration,
          and new models of scientific funding.
        </div>
      </CardWrapper>
      <div
        className={
          "flex w-full flex-row gap-x-8 border-b border-gray-600 text-lg"
        }
      >
        <div
          onClick={() => setType("DISCOVER")}
          className={cn(
            "border-primary cursor-pointer pb-2 font-bold",
            type === "DISCOVER" && "text-primary border-b-4",
          )}
        >
          Discover
        </div>
        <div
          onClick={() => setType("ANALYTICS")}
          className={cn(
            "border-primary cursor-pointer pb-2 font-bold",
            type === "ANALYTICS" && "text-primary border-b-4",
          )}
        >
          Analytics
        </div>
      </div>
      {type === "DISCOVER" ? (
        <div className={"grid grid-cols-3"}>
          <DaoGrid
            initParam={{
              status: ["LAUNCHED"],
              orderBy: "latest",
              owned: false,
              starred: false
            }}
          />
        </div>
      ) : (
        <LiveTable />
      )}
    </div>
  )
}

export default LiveDao
