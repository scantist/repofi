"use client"

import { SiDiscord, SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import type { IconType } from "@icons-pack/react-simple-icons"
import { useTour } from "@reactour/tour"
import { Footprints, House, Settings } from "lucide-react"
import { useSession } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import BannerWrapper from "~/components/banner-wrapper"
import CardWrapper from "~/components/card-wrapper"
import type { DaoLinks } from "~/lib/schema"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/react"

interface BannerProps {
  daoDetail?: DaoDetailResult
  id: string
}

const socialIcons: Record<string, IconType> = {
  website: House,
  x: SiX,
  discord: SiDiscord,
  telegram: SiTelegram
}

const IconComponent = ({ type, href }: { type: string; href: string }) => {
  if (href.trim().length === 0) {
    return null
  }
  const IconComponent = socialIcons[type]
  return IconComponent ? (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <IconComponent className={"h-6 w-6 text-muted-foreground hover:text-muted-foreground/50"} />
    </Link>
  ) : null
}

const Banner = ({ daoDetail, id }: BannerProps) => {
  const { data: session } = useSession()
  const { data } = api.dao.detail.useQuery(
    { daoId: id },
    {
      initialData: daoDetail
    }
  )
  const router = useRouter()
  const handleToDetail = () => {
    router.push(`/dao/${id}`)
  }
  const linksNode = useMemo(() => {
    return ["website", "x", "discord", "telegram"].map((socialType) => (
      <IconComponent key={socialType} type={socialType} href={(data?.links as DaoLinks)?.find((link) => link.type.toLowerCase() === socialType)?.value ?? ""} />
    ))
  }, [data])
  const { setIsOpen } = useTour()

  const handleClickStart = () => {
    setIsOpen(true)
  }

  return (
    <BannerWrapper className={"flex w-full flex-col"}>
      <div className={"my-10 flex w-full flex-col gap-8 md:flex-row"}>
        <CardWrapper className={"max-h-fit max-w-fit"}>
          <Image
            onClick={handleToDetail}
            height={240}
            width={335}
            className={"cursor-pointer aspect-square h-60 w-full rounded-t-lg object-cover"}
            alt={"banner"}
            src={daoDetail?.avatar ?? ""}
          />
        </CardWrapper>
        <div className={"flex flex-1 flex-col"}>
          <div className={"flex flex-row items-center justify-between gap-x-2"}>
            <div className={"flex flex-row items-end gap-x-4 "}>
              <div onClick={handleToDetail} className={"text-5xl font-bold tracking-tighter mr-4 cursor-pointer"}>
                {data?.name}
              </div>
              {linksNode}
            </div>
            <div className={"flex flex-row items-end gap-x-4 action"}>
              <Footprints className={"cursor-pointer text-primary-foreground hover:text-primary transition-all "} onClick={handleClickStart} aria-label={"Dao Tour"} />
              {data?.createdBy?.toLowerCase() === session?.address?.toLowerCase() && (
                <a href={`/dao/${id}/edit`}>
                  <Settings className={"text-primary-foreground hover:text-primary transition-all"} />
                </a>
              )}
            </div>
          </div>
          <Link href={data?.url ?? "#"} className={"mt-2 text-gray-500 w-auto max-w-fit"}>
            {data?.url}
          </Link>

          <div className={"mt-1 flex flex-row gap-4 text-sm"}>
            <div>License: {data?.license}</div>
            <div className={"border-l border-gray-400 pl-4"}>Star: {data?.repoStar}</div>
            <div className={"border-l border-gray-400 pl-4"}>Watch: {data?.repoWatch}</div>
            <div className={"border-l border-gray-400 pl-4"}>Fork: {data?.repoForks}</div>
          </div>
          <div
            className={"mt-4 text-sm line-clamp-6 overflow-auto"}
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none" // IE 10+
            }}
          >
            {data?.description}
          </div>
        </div>
      </div>
    </BannerWrapper>
  )
}

export default Banner
