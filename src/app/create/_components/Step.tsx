"use client"

import CardWrapper from "~/components/card-wrapper"
import React, { useEffect, useState } from "react"
import { stepAtom, stepPath } from "~/store/create-dao-store"
import { cn } from "~/lib/utils"
import { useAtom } from "jotai"
import { type CreateDaoStep } from "~/types/data"
import { useRouter } from "next/navigation"

const stepList: {
  level: number
  title: string
  url: string
  target: CreateDaoStep
}[] = [
  {
    level: 0,
    title: "Bind your open source repository",
    url: stepPath.BIND,
    target: "BIND"
  },
  {
    level: 1,
    title: "Configuration basic Information",
    url: stepPath.INFORMATION,
    target: "INFORMATION"
  },
  {
    level: 2,
    title: "Done!",
    url: stepPath.FINISH,
    target: "FINISH"
  }
]

const stepLevel = {
  BIND: 0,
  INFORMATION: 1,
  FINISH: 2
}

const Step = () => {
  const [current, setCurrent] = useState(0)
  const router = useRouter()
  const [currentStep, setCurrentStep] = useAtom(stepAtom)
  useEffect(() => {
    console.log("currentStep", currentStep)
    setCurrent(stepLevel[currentStep])
  }, [currentStep])
  return (
    <CardWrapper>
      <div className={"relative mx-6 flex flex-col gap-y-8 py-8"}>
        {stepList.map((item) => (
          <div
            className={cn(
              "flex flex-row items-center gap-4",
              item.level < current && "cursor-pointer",
            )}
            onClick={() => {
              if (item.level < current) {
                setCurrentStep(item.target)
                router.push(item.url)
              }
            }}
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
