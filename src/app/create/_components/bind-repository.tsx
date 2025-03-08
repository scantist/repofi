"use client"

import CardWrapper from "~/components/card-wrapper"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { LogOut } from "lucide-react"

const BindRepository = () => {
  return (
    <CardWrapper className={"col-span-1 flex w-full flex-col md:col-span-2"}>
      <div
        className={
          "bg-card flex flex-col items-center justify-center gap-10 px-14 py-8"
        }
      >
        <div className={"flex flex-row w-full justify-between items-center"}>
          <div className={"flex flex-row gap-x-3"}>
            <SiGithub />
            <div>lizhongyue248@163.com</div>
          </div>
          <LogOut />
        </div>
        <div className={"flex flex-col gap-4"}>

        </div>
      </div>
    </CardWrapper>
  )
}

export default BindRepository
