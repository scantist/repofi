"use client"

import React, { type FC } from "react"
import Link from "next/link"
import { SiDiscord, SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import CardWrapper from "~/components/card-wrapper"
import { type DaoPage } from "~/types/data"

type Props = {
  children?: React.ReactNode,
  data: DaoPage,
};

const DaoCard: FC<Props> = ({ data }) => {
  console.log("dao card", data)
  return (
    <CardWrapper borderClassName={"border-1"}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        className={"aspect-square h-60 w-full rounded-t-lg object-cover"}
        alt={"bg"}
        src={"http://downloads.echocow.cn/85936f2e95327e9e778b198c9b10fd6f.png"}
      />
      <div className={"mb-1 flex flex-col gap-1 rounded-b-lg bg-black p-5"}>
        <div className={"truncate text-3xl leading-10 tracking-tighter"}>
          {data.name}
        </div>
        <div className={"truncate text-sm text-white/58"}>
          Repository:&nbsp;
          <Link href={data.url}>{data.url}</Link>
        </div>
        <div className={"flex flex-row justify-between text-xs"}>
          <div>
            <span className={"mr-1"}>License:</span>
            <span className={"text-white/80"}>{data.license}</span>
          </div>
          <div>|</div>
          <div>
            <span className={"mr-1"}>Stars:</span>
            <span className={"text-white/80"}>{data.repoStar}</span>
          </div>
          <div>|</div>
          <div>
            <span className={"mr-1"}>Watch:</span>
            <span className={"text-white/80"}>{data.repoWatch}</span>
          </div>
          <div>|</div>
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
            <div className={"text-primary-foreground mt-2 text-lg font-bold"}>
              {data.info.marketCap}
            </div>
          </div>
          <div className={"pl-3"}>
            <div className={"text-muted-foreground text-sm"}># Holders</div>
            <div className={"text-primary-foreground mt-2 text-lg font-bold"}>
              {data.info.holderCount}
            </div>
          </div>
          <div className={"border-l-1 border-l-gray-400 pl-5"}>
            <div className={"text-muted-foreground text-sm"}>Status</div>
            <div className={"text-primary-foreground mt-2 text-lg font-bold"}>
              {data.status}
            </div>
          </div>
        </div>
        <div className={"flex flex-row items-center justify-between"}>
          <div className={"text-xs"}>More Info</div>
          <div className={"flex flex-row gap-2"}>
            <SiX className={"size-3"} />
            <SiDiscord className={"size-3"} />
            <SiTelegram className={"size-3"} />
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

export default DaoCard
