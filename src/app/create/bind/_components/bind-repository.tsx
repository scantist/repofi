"use client"

import React, { type FC, useEffect, useId, useRef, useState } from "react"
import CardWrapper from "~/components/card-wrapper"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { Eye, GitFork, LogOut, Search, Star, Users } from "lucide-react"
import { useOutsideClick } from "~/hooks/use-outside-click"
import { AnimatePresence, motion } from "motion/react"
import { type Repository } from "~/types/data"
import RepositoryInformation from "~/app/create/bind/_components/repository-information"
import { cn } from "~/lib/utils"
import BindRepositoryEmpty from "./bind-repository-empty"
import { useSession } from "next-auth/react"
import { DaoPlatform } from "@prisma/client"
import { api } from "~/trpc/react"
import { deleteCookie } from "cookies-next"
import LoadingSpinner from "~/app/components/loading-spinner"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import ListPagination from "~/components/list-pagination"
import { type Pageable } from "~/lib/schema"
import { RightArrow } from "next/dist/client/components/react-dev-overlay/ui/icons/right-arrow"
import createDaoStore, { createDaoAtom, stepAtom, stepPath } from "~/store/create-dao-store"
import { useAtom, useStore } from "jotai"
import { useRouter } from "next/navigation"

type Props = {
  githubToken?: string;
};

type Condition = {
  name: string;
  pageable: Pageable;
};

const BindRepository: FC<Props> = ({ githubToken }) => {
  const [active, setActive] = useState<Repository | null>(null)
  const [current, setCurrent] = useState<Repository | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const router = useRouter()
  const [daoParams, setDaoParams] = useAtom(createDaoAtom)
  const [step, setStep] = useAtom(stepAtom)
  const { data: session } = useSession()
  useEffect(() => {
    setStep("BIND")
  }, [])
  const [condition, setCondition] = useState<Condition>({
    name: "",
    pageable: {
      page: 0,
      size: 6
    }
  })
  const [searchTerm, setSearchTerm] = useState("")
  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () =>
    setActive(null),
  )

  const { data: repoResponse, isPending } = api.repo.fetchPublicRepos.useQuery(
    {
      accessToken: githubToken,
      platform: DaoPlatform.GITHUB,
      pageable: { ...condition.pageable }
    },
    { enabled: !!githubToken },
  )
  const { data: info } = api.repo.fetchPlatformInfo.useQuery(
    { accessToken: githubToken, platform: DaoPlatform.GITHUB },
    {
      enabled: !!githubToken,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false
    },
  )
  if (!session || !githubToken) {
    return (
      <CardWrapper className={"col-span-1 w-full md:col-span-2"} contentClassName={"bg-card "}>
        <BindRepositoryEmpty githubToken={githubToken} />
      </CardWrapper>
    )
  }

  const handleSearch = () => {
    setCondition((prev) => ({ ...prev, name: searchTerm, page: 0 }))
  }

  return (
    <CardWrapper className={"col-span-1 w-full md:col-span-2"} contentClassName={"bg-card "}>
      <div
        className={
          "bg-card flex flex-col items-center justify-center gap-4 py-8"
        }
      >
        <div
          className={"flex w-full flex-row items-center justify-between px-10"}
        >
          <div className={"flex flex-row gap-x-3"}>
            <SiGithub />
            <div>
              {info?.username} - {info?.email}
            </div>
          </div>
          <LogOut
            className={"cursor-pointer"}
            onClick={async () => {
              await deleteCookie("github_token")
              window.location.reload()
            }}
          />
        </div>
        <div className="flex w-full gap-2 px-10 text-gray-400">
          <Input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-primary flex-grow"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4" />
          </Button>
        </div>
        <RepositoryInformation
          id={id}
          repo={active}
          ref={ref}
          onClose={() => setActive(null)}
        />
        {isPending ? (
          <LoadingSpinner
            size={64}
            className="my-8"
            text="Loading repository..."
          />
        ) : (
          <div className={"flex w-full flex-col gap-4"}>
            {repoResponse?.list.map((repo, index) => (
              <motion.div
                layoutId={`card-${repo.name}-${id}`}
                key={`card-${repo.name}-${id}`}
                className={cn(
                  "mx-10 my-2 flex flex-col gap-2 border-b border-b-neutral-400 px-4 py-2 pb-4 transition",
                )}
              >
                <div className={"flex flex-row items-center justify-between"}>
                  <div className={"flex flex-row gap-x-4"}>
                    <motion.h3
                      layoutId={`title-${repo.name}-${id}`}
                      className="text-2xl font-bold"
                    >
                      {repo.name}
                    </motion.h3>
                  </div>
                  <div className={"flex flex-row items-center gap-x-4"}>
                    <motion.h3
                      layoutId={`title-star-${repo.name}-${id}`}
                      className={"flex flex-row items-center gap-x-2 text-sm"}
                    >
                      <Star className={"size-4"} />
                      {repo.star}
                    </motion.h3>
                    <motion.h3
                      layoutId={`title-fork-${repo.name}-${id}`}
                      className={"flex flex-row items-center gap-x-2 text-sm"}
                    >
                      <GitFork className={"size-4"} />
                      {repo.fork}
                    </motion.h3>
                    <motion.h3
                      layoutId={`title-watch-${repo.name}-${id}`}
                      className={"flex flex-row items-center gap-x-2 text-sm"}
                    >
                      <Eye className={"size-4"} />
                      {repo.watch}
                    </motion.h3>
                  </div>
                </div>
                <div className="mt-2">
                  <motion.p
                    layoutId={`description-${repo.description}-${id}`}
                    className="text-left text-neutral-400"
                  >
                    {repo.description}
                  </motion.p>
                </div>
                <div className={"flex flex-row items-center justify-between"}>
                  <motion.div
                    className={
                      "flex cursor-pointer flex-row items-center gap-x-2 font-thin"
                    }
                    onClick={() => setActive(repo)}
                  >
                    <Users className={"size-4"} />
                    Contributors
                  </motion.div>
                  <div className={"flex flex-row gap-4"}>
                    <div
                      className={cn(
                        "cursor-pointer overflow-hidden font-bold whitespace-nowrap",
                        current === repo && "text-primary",
                      )}
                      onClick={() => {
                        setCurrent(repo)
                        setStep("INFORMATION")
                        setDaoParams({
                          ...daoParams,
                          url: repo.url
                        })
                        router.push(stepPath.INFORMATION)
                      }}
                    >
                      Bind
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        <div className={"flex w-full flex-row justify-between px-10"}>
          {repoResponse && (
            <ListPagination
              pageable={condition.pageable}
              totalPages={repoResponse?.pages ?? 0}
              setPageable={(pageable) => {
                setCondition({ ...condition, pageable })
              }}
            />
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

export default BindRepository
