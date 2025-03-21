"use client"

import CardWrapper from "~/components/card-wrapper"
import Image from "next/image"
import { SiDiscord, SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import BannerWrapper from "~/components/banner-wrapper"
import { type DaoDetailResult } from "~/server/service/dao"
import { Button } from "~/components/ui/button"
import { useAuth } from "~/components/auth/auth-context"
import { usePathname, useRouter } from "next/navigation"
import { api } from "~/trpc/react"

interface BannerProps {
  daoDetail?: DaoDetailResult
  id: string
}

const Banner = ({ daoDetail, id }: BannerProps) => {
  const { data } = api.dao.detail.useQuery(
    {
      daoId: id
    },
    {
      initialData: daoDetail
    }
  )
  const { address } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const handleEditClick = () => {
    router.push(`/dao/${data?.id}/edit`)
  }
  const isEditPage = pathname.endsWith("/edit")
  return (
    <BannerWrapper className={"flex w-full flex-col"}>
      <div className={"my-10 flex w-full flex-col gap-8 md:flex-row"}>
        <CardWrapper className={"max-h-fit max-w-fit"}>
          <Image height={240} width={335} className={"aspect-square h-60 w-full rounded-t-lg object-cover"} alt={"banner"} src={data?.avatar ?? ""} />
        </CardWrapper>
        <div className={"flex flex-1 flex-col"}>
          <div className={"flex flex-row items-center justify-between gap-x-2"}>
            <div className={"flex flex-row gap-x-2"}>
              <div className={"text-5xl font-bold tracking-tighter"}>{data?.name}</div>
              <SiX className={"ml-6"} />
              <SiDiscord />
              <SiTelegram />
            </div>
            {data?.createdBy?.toLowerCase() === address?.toLowerCase() && !isEditPage && <Button onClick={handleEditClick}>EDIT</Button>}
          </div>
          <div className={"mt-2 text-gray-500"}>Repository: {data?.url}</div>
          <div className={"mt-1 flex flex-row gap-4 text-sm"}>
            <div>License: {data?.license}</div>
            <div className={"border-l border-gray-400 pl-4"}>Stars: {data?.repoStar}</div>
            <div className={"border-l border-gray-400 pl-4"}>Watch: {data?.repoWatch}</div>
            <div className={"border-l border-gray-400 pl-4"}>Forks: {data?.repoForks}</div>
          </div>
          <div className={"mt-4 text-sm"}>{data?.description}</div>
        </div>
      </div>
    </BannerWrapper>
  )
}

export default Banner
