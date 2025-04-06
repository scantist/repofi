import React from "react"
import CardWrapper from "~/components/card-wrapper"
import { Skeleton } from "~/components/ui/skeleton"

const DaoCardSkeleton = () => {
  return (
    <CardWrapper className="block transition-all duration-300 hover:brightness-70 rounded-lg">
      <Skeleton className={"h-60 w-full rounded-t-lg"} />
      <div className={"p-5 space-y-4"}>
        <Skeleton className={"truncate w-64 h-8 text-3xl leading-10 tracking-tighter"} />
        <Skeleton className={"truncate w-full h-4 text-sm text-white/58"} />
        <div className={"grid grid-cols-4 gap-4"}>
          <Skeleton className={"w-full h-3"} />
          <Skeleton className={"w-full h-3"} />
          <Skeleton className={"w-full h-3"} />
          <Skeleton className={"w-full h-3"} />
        </div>
        <div className={"grid grid-cols-3 gap-4 py-1"}>
          <Skeleton className={"w-full h-16"} />
          <Skeleton className={"w-full h-16"} />
          <Skeleton className={"w-full h-16"} />
        </div>
        <div className={"flex flex-row justify-between pt-4"}>
          <Skeleton className={"w-12 h-4"} />
          <Skeleton className={"w-12 h-4"} />
        </div>
      </div>
    </CardWrapper>
  )
}

export default DaoCardSkeleton
