"use client"

import CardWrapper from "~/components/card-wrapper"
import React, {useMemo} from "react"
import {cn} from "~/lib/utils"
import {usePathname, useRouter} from "next/navigation"

const Step = () => {
  const router = useRouter()
  const steps = {
    "/create/bind": {
      level: 0,
      title: "Bind your open source repository",
      target: "BIND",
    },
    "/create/information": {
      level: 1,
      title: "Configuration basic Information",
    },
    "/create/finish": {
      level: 2,
      title: "Done!",
      target: "FINISH",
    }
  } as const

  const pathname = usePathname()
  const currentStep = useMemo(() => {
    console.log("pathname",pathname)
    const step = steps[pathname as keyof typeof steps];
    return step || steps["/create/bind"];
  }, [pathname])
  return (
    <CardWrapper>
      <div className={"relative mx-6 flex flex-col gap-y-8 py-8"}>
        {Object.entries(steps)
          .sort(([, a], [, b]) => a.level - b.level)
          .map(([key, item]) => (
            <div
              className={cn("flex flex-row items-center gap-4", item.level < currentStep.level && "cursor-pointer")}
              onClick={() => {
                if (item.level < currentStep.level) {
                  router.push(key)
                }
              }}
              key={`step-${item.title}-${item.level}`}
            >
              <div
                className={cn("h-8 w-8 rounded-full bg-gray-600 p-1 text-center font-bold text-gray-400", item.level <= currentStep.level && "bg-secondary text-white")}>
                {item.level + 1}
              </div>
              <div className={cn("text-gray-400", item.level <= currentStep.level && "text-white")}>{item.title}</div>
            </div>
          ))}
      </div>
    </CardWrapper>
  )
}

export default Step
