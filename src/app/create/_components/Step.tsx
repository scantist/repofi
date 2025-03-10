"use client"

import CardWrapper from "~/components/card-wrapper"
import React, { useState } from "react"
import { useStore } from "jotai/index"
import { stepAtom, stepPath } from "~/store/create-dao-store"
import { cn } from "~/lib/utils"

const stepList = [
  {
    level: 0,
    title: "Bind your open source repository",
    url: stepPath.BIND
  },
  {
    level: 1,
    title: "Configuration base Information",
    url: stepPath.INFORMATION
  },
  {
    level: 2,
    title: "Launch your token",
    url: stepPath.LAUNCH
  },
  {
    level: 3,
    title: "Done!",
    url: stepPath.FINISH
  }
]

const stepLevel = {
  BIND: 0,
  INFORMATION: 1,
  LAUNCH: 2,
  FINISH: 3
}

const Step = () => {
  const store = useStore()
  const [current, setCurrent] = useState(0)
  store.sub(stepAtom, () => {
    const currentStep = store.get(stepAtom)
    setCurrent(stepLevel[currentStep])
  })
  return (
    <CardWrapper contentClassName={"bg-card"}>
      <div className={"relative mx-6 flex flex-col gap-y-8 py-8"}>
        {stepList.map((item) => (
          <div
            className={"flex flex-row items-center gap-4"}
            key={`step-${item.title}-${item.level}`}
          >
            <div
              className={cn(
                "h-8 w-8 rounded-full bg-gray-600 p-1 text-center font-bold text-gray-400",
                item.level <= current && "bg-secondary text-white",
              )}
            >
              {item.level + 1}
            </div>
            <div
              className={cn(
                "text-gray-400",
                item.level <= current && "text-white",
              )}
            >
              {item.title}
            </div>
          </div>
        ))}
      </div>
    </CardWrapper>
  )
}

export default Step
