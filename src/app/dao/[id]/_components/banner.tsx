import { SiDiscord, SiHomepage, SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import type { IconType } from "@icons-pack/react-simple-icons"
import Image from "next/image"
import Link from "next/link"
import BannerWrapper from "~/components/banner-wrapper"
import CardWrapper from "~/components/card-wrapper"
import type { DaoLinks } from "~/lib/schema"
import { auth } from "~/server/auth"
import type { DaoDetailResult } from "~/server/service/dao"

interface BannerProps {
  daoDetail?: DaoDetailResult
  id: string
}

const socialIcons: Record<string, IconType> = {
  website: SiHomepage,
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

const Banner = async ({ daoDetail, id }: BannerProps) => {
  const session = await auth()
  return (
    <BannerWrapper className={"flex w-full flex-col"}>
      <div className={"my-10 flex w-full flex-col gap-8 md:flex-row"}>
        <CardWrapper className={"max-h-fit max-w-fit"}>
          <Image height={240} width={335} className={"aspect-square h-60 w-full rounded-t-lg object-cover"} alt={"banner"} src={daoDetail?.avatar ?? ""} />
        </CardWrapper>
        <div className={"flex flex-1 flex-col"}>
          <div className={"flex flex-row items-center justify-between gap-x-2"}>
            <div className={"flex flex-row items-end gap-x-4 "}>
              <div className={"text-5xl font-bold tracking-tighter mr-4"}>{daoDetail?.name}</div>
              {["website", "x", "discord", "telegram"].map((socialType) => (
                <IconComponent key={socialType} type={socialType} href={(daoDetail?.links as DaoLinks)?.find((link) => link.type.toLowerCase() === socialType)?.value ?? ""} />
              ))}
            </div>
            {daoDetail?.createdBy?.toLowerCase() === session?.address?.toLowerCase() && <a href={`/dao/${id}/edit`}>EDIT</a>}
          </div>
          <Link href={daoDetail?.url ?? "#"} className={"mt-2 text-gray-500"}>
            {daoDetail?.url}
          </Link>

          <div className={"mt-1 flex flex-row gap-4 text-sm"}>
            <div>License: {daoDetail?.license}</div>
            <div className={"border-l border-gray-400 pl-4"}>Stars: {daoDetail?.repoStar}</div>
            <div className={"border-l border-gray-400 pl-4"}>Watch: {daoDetail?.repoWatch}</div>
            <div className={"border-l border-gray-400 pl-4"}>Forks: {daoDetail?.repoForks}</div>
          </div>
          <div className={"mt-4 text-sm"}>{daoDetail?.description}</div>
        </div>
      </div>
    </BannerWrapper>
  )
}

export default Banner
