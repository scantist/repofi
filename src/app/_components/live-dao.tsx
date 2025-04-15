"use client"

import { AlignLeft, LayoutGrid } from "lucide-react"
import { useState } from "react"
import LiveTable from "~/app/_components/live-table"
import CardWrapper from "~/components/card-wrapper"
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group"
import { cn } from "~/lib/utils"
import type { DaoSearchResult } from "~/server/service/dao"
import DaoGrid from "./dao-grid"

interface LiveDaoProps {
  initialData?: DaoSearchResult
}

const LiveDao = ({ initialData }: LiveDaoProps) => {
  const [type, setType] = useState<"DISCOVER" | "ANALYTICS">("ANALYTICS")
  return (
    <div className={"mx-auto flex min-h-full w-full max-w-7xl flex-col gap-4 px-4 pt-10 pb-10"}>
      <div className={"text-4xl font-bold flex flex-grow items-center justify-between"}>
        <div>Launched DAOs</div>
        <ToggleGroup type="single" value={type} onValueChange={(e) => setType(e as "ANALYTICS" | "DISCOVER")}>
          <ToggleGroupItem value="ANALYTICS" className={"p-2 cursor-pointer rounded-md data-[state=on]:border-primary data-[state=on]:border"}>
            <AlignLeft className="h-4 w-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="DISCOVER" className={"p-2 cursor-pointer rounded-md data-[state=on]:border-primary data-[state=on]:border"}>
            <LayoutGrid className="h-4 w-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className={"text-muted-foreground text-sm font-thin"}>
        Successfully funded projects now building with community support. Track their progress and get involved in development.
      </div>
      {type === "DISCOVER" ? (
        <DaoGrid
          initialData={initialData}
          initParam={{
            status: ["LAUNCHED"],
            orderBy: "latest",
            owned: false,
            starred: false
          }}
        />
      ) : (
        <LiveTable initialData={initialData} />
      )}
    </div>
  )
}

export default LiveDao
