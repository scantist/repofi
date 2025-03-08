"use client"

import React, { type FC, useEffect, useId, useRef, useState } from "react"
import CardWrapper from "~/components/card-wrapper"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { Eye, GitFork, LogOut, Star, Users } from "lucide-react"
import { useOutsideClick } from "~/hooks/use-outside-click"
import { AnimatePresence, motion } from "motion/react"
import { type Repository } from "~/types/data"
import RepositoryInformation from "~/app/create/_components/repository-information"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import AvatarGroupMax from "~/components/ui/avatar-group-max"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import BindRepositoryEmpty from "./bind-repository-empty"
import { signOut, useSession } from "next-auth/react"
import { repoService } from "~/server/service/repo"
import { DaoPlatform } from "@prisma/client"
import { api } from "~/trpc/react"

type Props = {
  githubToken?: string;
};

const BindRepository: FC<Props> = ({ githubToken }) => {
  const [active, setActive] = useState<Repository | boolean | null>(null)
  const [current, setCurrent] = useState<Repository | boolean | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  const { data: session } = useSession()

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () =>
    setActive(null),
  )


  if (!session || !githubToken) {
    return (
      <CardWrapper className={"col-span-1 flex w-full flex-col md:col-span-2"}>
        <BindRepositoryEmpty githubToken={githubToken} />
      </CardWrapper>
    )
  }
  const { data:repoResponse, isLoading } = api.repo.fetchPublicRepos.useQuery(
    { accessToken: githubToken,platform: DaoPlatform.GITHUB,pageable:{ page:0,size:10 } },
    { enabled: !!githubToken }
  )
  const { data:info } = api.repo.fetchPlatformInfo.useQuery(
    { accessToken: githubToken,platform: DaoPlatform.GITHUB },
    { enabled: !!githubToken }
  )
  console.log(repoResponse?.pages)
  return (
    <CardWrapper className={"col-span-1 flex w-full flex-col md:col-span-2"}>
      <div
        className={
          "bg-card flex flex-col items-center justify-center gap-4 py-8"
        }
      >
        <div
          className={"flex w-full flex-row items-center justify-between px-14"}
        >
          <div className={"flex flex-row gap-x-3"}>
            <SiGithub />
            <div>
              {info?.username} - {info?.email}
            </div>
          </div>
          <LogOut className={"cursor-pointer"} onClick={() => signOut()} />
        </div>
        <RepositoryInformation
          id={id}
          repo={active}
          ref={ref}
          onClose={() => setActive(null)}
        />
        <div className={"flex flex-col gap-4"}>
          {repoResponse?.list.map((repo, index) => (
            <motion.div
              layoutId={`card-${repo.name}-${id}`}
              key={`card-${repo.name}-${id}`}
              className={cn(
                "mx-10 my-2 flex flex-col gap-4 border-b border-b-neutral-400 px-4 py-2 pb-4 transition",
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
                  className={"cursor-pointer font-thin flex flex-row gap-x-2 items-center"}
                  onClick={() => setActive(repo)}
                >
                  <Users className={"size-4"} />
                  Contributors
                </motion.div>
                <div className={"flex flex-row gap-4"}>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current === repo ? "unbind" : "bind"}
                      layout
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      onClick={() => setCurrent(repo)}
                      className={cn(
                        "cursor-pointer overflow-hidden font-bold whitespace-nowrap",
                        current === repo && "text-primary",
                      )}
                      style={{ display: "inline-block" }}
                    >
                      {current === repo ? "Unbind" : "Bind"}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CardWrapper>
  )
}

export default BindRepository
