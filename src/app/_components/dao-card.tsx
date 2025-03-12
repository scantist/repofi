"use client"

import React, { type FC } from "react"
import Link from "next/link"
import { SiDiscord, SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import CardWrapper from "~/components/card-wrapper"
import { type DaoPage } from "~/types/data"
import { type DaoLinks } from "~/lib/schema"
import { House } from "lucide-react"
import { useRouter } from "next/navigation"

type Props = {
  children?: React.ReactNode,
  data: DaoPage,
};

const DaoCard: FC<Props> = ({ data }) => {

  const router = useRouter()
  const IconComponent = ({ type, href }: { type: string, href: string }) => {
    let Icon
    if (type.toLowerCase() === "website") {
      Icon = House
    } else {
      const IconName = `Si${type.charAt(0).toUpperCase() + type.slice(1)}`
      Icon = {
        SiX,
        SiDiscord,
        SiTelegram
      }[IconName]
    }
    return Icon ? <Link href={href} className={"cursor-pointer"} target={"_blank"}>
      <Icon className="size-3" />
    </Link> : null
  }
  return (
    <CardWrapper borderClassName={"border-1"} >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={"aspect-square h-60 w-full rounded-t-lg object-cover"}
        alt={"bg"}
        src={"https://storage.googleapis.com/repofi/launchpad/avatar/1741621897031_85936f2e95.png"}
      />
      <div className={"mb-1 flex flex-col gap-1 rounded-b-lg bg-black p-5"}>
        <div className={"truncate text-3xl leading-10 tracking-tighter"}>
          {data.name}
        </div>
        <div className={"truncate text-sm text-white/58"}>
          <Link href={data.url}>{data.url}</Link>
        </div>
        <div className={"flex flex-row gap-x-6 mt-2 text-xs"}>
          <div>
            <span className={"mr-1"}>Stars:</span>
            <span className={"text-white/80"}>{data.repoStar}</span>
          </div>
          <div>
            <span className={"mr-1"}>Watch:</span>
            <span className={"text-white/80"}>{data.repoWatch}</span>
          </div>
          <div>
            <span className={"mr-1"}>Forks:</span>
            <span className={"text-white/80"}>{data.repoForks}</span>
          </div>
        </div>
        <div
          className={
            "my-4 grid grid-cols-3 justify-evenly gap-1 border-y-1 border-y-gray-400 py-3 font-light"
          }
        >
          <div className={"mr-2 border-r-1 border-r-gray-400"}>
            <div className={"text-muted-foreground text-sm"}>Market cap</div>
            <div className={"text-primary-foreground mt-2 text-md font-bold"}>
              {data.tokenInfo.marketCap.length === 0 ? "0" : data.tokenInfo.marketCap}
            </div>
          </div>
          <div className={"pl-3"}>
            <div className={"text-muted-foreground text-sm"}># Holders</div>
            <div className={"text-primary-foreground mt-2 text-md font-bold"}>
              {data.tokenInfo.holderCount}
            </div>
          </div>
          <div className={"border-l-1 border-l-gray-400 pl-5"}>
            <div className={"text-muted-foreground text-sm"}>Status</div>
            <div className={"text-primary-foreground mt-2 text-md tracking-tighter font-bold"}>
              {data.status}
            </div>
          </div>
        </div>
        <div className={"flex flex-row items-center justify-between"}>
          <div className={"text-sm cursor-pointer font-bold"} onClick={() => {
            router.push("/dao/test")
          }}>DETAIL</div>
          <div className={"flex flex-row gap-2"}>
            {
              (data.links as DaoLinks).map((link, index) => (
                <IconComponent key={index} type={link.type} href={link.value}/>
              ))
            }
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

export default DaoCard
