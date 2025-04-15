"use client"

import { SiGithub } from "@icons-pack/react-simple-icons"
import { formatDistanceToNow } from "date-fns"
import { Calendar, Eye, GitFork, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
import DaoCardSkeleton from "~/app/_components/dao-card-skeleton"
import { useAuth } from "~/components/auth/auth-context"
import CardWrapper from "~/components/card-wrapper"
import ListPagination from "~/components/list-pagination"
import NoData from "~/components/no-data"
import { Badge } from "~/components/ui/badge"
import type { HomeSearchParams, Pageable } from "~/lib/schema"
import { cn, extractOwnerRepo, formatNumber } from "~/lib/utils"
import type { DaoSearchResult } from "~/server/service/dao"
import { api } from "~/trpc/react"

interface Props {
  initialData?: DaoSearchResult
  daoParam?: HomeSearchParams
}

const DaoItem = ({ dao }: { dao: DaoSearchResult["list"][number] }) => {
  const { isAuthenticated, openDialog } = useAuth()
  const useUtils = api.useUtils()
  const { mutate } = api.dao.toggleStar.useMutation({
    onSuccess: () => {
      void useUtils.dao.search.refetch()
    }
  })
  const router = useRouter()
  return (
    <CardWrapper>
      <div className="w-full group/card relative">
        <div
          className={cn(
            "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl backgroundImage flex flex-col justify-between p-4",
            "object-cover bg-center",
            "relative overflow-hidden"
          )}
          style={{ backgroundImage: `url(${dao.avatar})` }}
          onClick={() => router.push(`/dao/${dao.id}`)}
        >
          <div className="absolute w-full h-full top-0 left-0 transition duration-300 group-hover/card:opacity-70 bg-black opacity-60 " />
          <div className="flex flex-row items-center space-x-4 z-10 h-fit transition-all duration-500 group-hover:-translate-y-32">
            <div className="flex flex-col gap-2">
              <div className="font-normal text-base text-gray-50 relative z-10 flex flex-row gap-2 items-center">
                <SiGithub size={16} />
                <div>{extractOwnerRepo(dao.url)}</div>
              </div>
              <div className={"flex flex-row items-center gap-4 text-gray-400 opacity-70 text-sm"}>
                <div className={"flex flex-row items-center gap-1"}>
                  <Calendar className={"inline-block "} size={16} />
                  <div>{formatDistanceToNow(dao.createdAt)}</div>
                </div>
                <div className={"flex flex-row items-center gap-1"}>
                  <Star className={"inline-block "} size={16} />
                  <div>{formatNumber(dao.repoStar)}</div>
                </div>
                <div className={"flex flex-row items-center gap-1"}>
                  <Eye className={"inline-block "} size={16} />
                  <div>{formatNumber(dao.repoWatch)}</div>
                </div>
                <div className={"flex flex-row items-center gap-1"}>
                  <GitFork className={"inline-block "} size={16} />
                  <div>{formatNumber(dao.repoForks)}</div>
                </div>
              </div>
            </div>
          </div>
          <div className="text h-32 content group-hover:h-96 group-hover:-translate-y-12 transition-all duration-500">
            <div className="font-bold text-xl md:text-3xl text-gray-50 relative z-10 flex flex-row justify-between gap-4 items-center">
              <div className={"flex flex-row gap-4 items-center"}>
                <div>{dao.name}</div>
                <Star
                  className={cn("text-white/40 hover:scale-125 hover:fill-yellow-400 hover:text-yellow-400 z-20 transition", dao.isStarred && "text-yellow-400 fill-yellow-400")}
                  onClick={(event) => {
                    event.preventDefault()
                    if (!isAuthenticated) {
                      void openDialog()
                    } else {
                      mutate({ daoId: dao.id })
                    }
                    event.stopPropagation()
                  }}
                />
                <Badge className={"text-sm"}>${dao.ticker.toUpperCase()}</Badge>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(dao.url, '_blank', 'noopener,noreferrer')
                }}
                className={"opacity-0 group-hover:opacity-100 transition-opacity duration-500 hover:opacity-50 hover:duration-100 cursor-pointer"}
              >
                <SiGithub size={24} />
              </button>
            </div>
            <p className="font-normal text-sm text-gray-50 relative z-10 my-4 line-clamp-3 group-hover:line-clamp-[15] transition-[line-clamp] duration-500">
              {dao.description}
            </p>
          </div>
        </div>
      </div>
    </CardWrapper>
  )
}

const PreDao = ({ daoParam, initialData }: Props) => {
  const [pageable, setPageable] = useState<Pageable>({
    page: 0,
    size: 6
  })
  const { data: response, isPending } = api.dao.search.useQuery(
    {
      ...pageable,
      ...daoParam
    },
    { initialData: initialData }
  )

  if (isPending) {
    return (
      <div className={"grid grid-cols-1 gap-x-2 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"}>
        {Array(6)
          .fill(null)
          .map((_, index) => (
            <DaoCardSkeleton key={`dao-skeleton-${index}`} />
          ))}
      </div>
    )
  }
  return (
    <div className={"mx-0 md:mx-auto flex min-h-full w-full max-w-7xl flex-col gap-4 px-4 pt-10 pb-10"}>
      <div className={"text-4xl font-bold"}>UpComing DAOs</div>
      <div className={"text-muted-foreground text-sm font-thin"}>
        These are DAO that will be fundraising soon, and you can pay attention to DAO that you are interested in earlier.
      </div>
      <div className={"grid grid-cols-1 gap-x-2 gap-y-5 sm:grid-cols-2 lg:grid-cols-3"}>
        {response && response?.list.length > 0 ? (
          <>
            {response?.list.map((item) => (
              <div key={`pre-launch-dao-${item.id}`}>
                <DaoItem dao={item} />
              </div>
            ))}
            <div className={"col-span-1 mt-6 sm:col-span-2 lg:col-span-3"}>
              <ListPagination pageable={pageable} totalPages={response?.pages ?? 0} setPageable={setPageable} />
            </div>
          </>
        ) : (
          <NoData size={96} className={"col-span-1 my-20 sm:col-span-2 lg:col-span-3"} />
        )}
      </div>
    </div>
  )
}
export default PreDao
