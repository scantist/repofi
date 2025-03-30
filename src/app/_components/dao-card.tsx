"use client"

import { SiDiscord, SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import { Label } from "@radix-ui/react-label"
import { House } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import type { FC } from "react"
import CardWrapper from "~/components/card-wrapper"
import type { DaoLinks } from "~/lib/schema"
import { formatMoney } from "~/lib/utils"
import type { DaoPage } from "~/types/data"

type Props = {
  children?: React.ReactNode
  data: DaoPage
}

const DaoCard: FC<Props> = ({ data }) => {
  const router = useRouter()
  const IconComponent = ({ type, href }: { type: string; href: string }) => {
    let Icon = null
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

    if (Icon) {
      return href ? (
        <Label>
          <Icon className="size-4" />
        </Label>
      ) : (
        <Icon className="size-4 text-foreground/30" />
      )
    }

    return null
  }
  return (
    <Link href={`/dao/${data.id}`} className="block cursor-pointer transition-all duration-300 hover:brightness-70 rounded-lg">
      <CardWrapper>
        <img className={"aspect-square h-60 w-full rounded-t-lg object-cover"} alt={data.name} src={data.avatar} />
        <div className={"flex flex-col gap-1 rounded-b-lg bg-black p-5"}>
          <div className={"truncate text-3xl leading-10 tracking-tighter"}>{data.name}</div>
          <div className={"truncate text-sm text-white/58"}>
            <p>{data.url}</p>
          </div>
          <div className={"mt-2 flex flex-row justify-between items-center text-xs"}>
            <div className="flex flex-row gap-x-6">
              <div>
                <span className={"mr-1"}>Star:</span>
                <span className={"text-white/80"}>{data.repoStar}</span>
              </div>
              <div>
                <span className={"mr-1"}>Watch:</span>
                <span className={"text-white/80"}>{data.repoWatch}</span>
              </div>
              <div>
                <span className={"mr-1"}>Fork:</span>
                <span className={"text-white/80"}>{data.repoForks}</span>
              </div>
            </div>
            <div>
              <span className={"mr-1"}>License:</span>
              <span className={"text-white/80"}>{data.license || "N/A"}</span>
            </div>
          </div>
          <div className={"my-4 grid grid-cols-3 justify-evenly gap-1 border-y-1 border-y-gray-400 py-3 font-light"}>
            <div className={"mr-2 border-r-1 border-r-gray-400"}>
              <div className={"text-muted-foreground text-sm"}>Market cap</div>
              <div className={"text-primary-foreground text-md mt-2 font-bold"}>${formatMoney(data.marketCapUsd.length === 0 ? "0" : data.marketCapUsd)}</div>
            </div>
            <div className={"pl-3"}>
              <div className={"text-muted-foreground text-sm"}># Holders</div>
              <div className={"text-primary-foreground text-md mt-2 font-bold"}>{data.tokenInfo.holderCount}</div>
            </div>
            <div className={"border-l-1 border-l-gray-400 pl-5"}>
              <div className={"text-muted-foreground text-sm"}>Status</div>
              <div className={"text-primary-foreground text-md mt-2 font-bold tracking-tighter"}>{data.status}</div>
            </div>
          </div>
          <div className={"flex flex-row items-center justify-between"}>
            <div className={"flex flex-row gap-2"}>
              {["website", "x", "discord", "telegram"].map((socialType) => (
                <IconComponent key={socialType} type={socialType} href={(data.links as DaoLinks).find((link) => link.type.toLowerCase() === socialType)?.value ?? ""} />
              ))}{" "}
            </div>
            <div className={"cursor-pointer text-sm font-bold"}>${data.ticker}</div>
          </div>
        </div>
      </CardWrapper>
    </Link>
  )
}

export default DaoCard
