"use client"
import {AnimatePresence, motion} from "motion/react"
import React, {type FC, useEffect, useState} from "react"
import {type Repository} from "~/types/data"
import {Eye, GitFork, Star, X} from "lucide-react"
import {cn} from "~/lib/utils"
import {GlowingEffect} from "~/components/ui/glowing-effect"
import {api} from "~/trpc/react"
import LoadingSpinner from "~/app/_components/loading-spinner"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "~/components/ui/tooltip"
import {Avatar, AvatarFallback, AvatarImage} from "~/components/ui/avatar"
import {Button} from "~/components/ui/button"
import ListPagination from "~/components/list-pagination"
import {Pageable} from "~/lib/schema";

type Props = {
  repo: Repository | null
  id: string
  onClose: () => void
  ref: React.RefObject<HTMLDivElement | null>
}

const RepositoryInformation: FC<Props> = ({repo, id, onClose, ref}) => {
  const [pageable, setPageable] = useState<Pageable>({
    page: 0,
    size: 9
  })
  // 添加 useEffect 来监听 repo 的变化
  useEffect(() => {
    // 当 repo 改变时，重置 pageable
    setPageable({
      page: 0,
      size: 9
    })
  }, [repo])
  const {data: contributorsResponse, isPending} = api.repo.fetchRepoContributors.useQuery({
    url: repo?.url,
    pageable: pageable,
  })
  return (
    <>
      <AnimatePresence>
        {repo && typeof repo === "object" && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}}
                      className="fixed inset-0 z-10 h-full w-full bg-black/20"/>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {repo && typeof repo === "object" ? (
          <div className="fixed inset-0 z-[100] grid place-items-center">
            <motion.button
              key={`button-${repo.name}-${id}`}
              layout
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05
                }
              }}
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white lg:hidden"
              onClick={onClose}
            >
              <X/>
            </motion.button>
            <motion.div
              layoutId={`card-${repo.name}-${id}`}
              ref={ref}
              className={cn("flex h-full w-full p-4 max-w-[700px] flex-col overflow-hidden rounded-lg md:h-fit md:max-h-[90%]")}
            >
              <div className="relative h-full rounded-2.5xl border bg-neutral-900 p-2  md:rounded-3xl md:p-3">
                <GlowingEffect blur={0} borderWidth={3} spread={80} glow={true} disabled={false} proximity={64}
                               inactiveZone={0.01}/>
                <div
                  className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6  dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
                  <div className={"flex flex-row items-center justify-between"}>
                    <div className={"flex flex-row gap-x-4"}>
                      <motion.h3 layoutId={`title-${repo.name}-${id}`} className="text-2xl font-bold">
                        {repo.name}
                      </motion.h3>
                    </div>
                    <div className={"flex flex-row items-center gap-x-4"}>
                      <motion.h3 layoutId={`title-star-${repo.name}-${id}`}
                                 className={"flex flex-row items-center gap-x-2 text-sm"}>
                        <Star className={"size-4"}/>
                        {repo.star}
                      </motion.h3>
                      <motion.h3 layoutId={`title-fork-${repo.name}-${id}`}
                                 className={"flex flex-row items-center gap-x-2 text-sm"}>
                        <GitFork className={"size-4"}/>
                        {repo.fork}
                      </motion.h3>
                      <motion.h3 layoutId={`title-watch-${repo.name}-${id}`}
                                 className={"flex flex-row items-center gap-x-2 text-sm"}>
                        <Eye className={"size-4"}/>
                        {repo.watch}
                      </motion.h3>
                    </div>
                  </div>
                  <div className="mt-2">
                    <motion.p layoutId={`description-${repo.description}-${id}`} className="text-left text-neutral-400">
                      {repo.description}
                    </motion.p>
                  </div>
                  <TooltipProvider>
                    <div className="w-full border-t border-t-neutral-500 pt-8">
                        {isPending ? (
                          <LoadingSpinner className="mx-auto" size={64} text="Loading contributors..."/>
                        ) : (
                          <div className="grid grid-cols-3 gap-4 h-full overflow-y-auto">
                            {contributorsResponse?.list.map((item) => (
                              <div key={`${repo.name}-${item.id}`} className="flex flex-col items-center text-center">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Avatar className="mb-2">
                                      <AvatarImage src={item.avatar} alt={`@${item.name}`}/>
                                      <AvatarFallback>{item.name}</AvatarFallback>
                                    </Avatar>
                                  </TooltipTrigger>
                                  <TooltipContent className="font-semibold">
                                    {item.name} - {item.contributions} contributions
                                  </TooltipContent>
                                </Tooltip>
                                <span className="text-sm font-medium truncate w-full">{item.name}</span>
                                <span className="text-xs text-neutral-400">{item.contributions} contributions</span>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                    <div className={"flex w-full flex-row justify-between px-10 mt-4"}> {/* 添加上边距 */}
                      {contributorsResponse && (
                        <ListPagination
                          pageable={pageable}
                          totalPages={contributorsResponse?.pages ?? 0}
                          setPageable={setPageable}
                        />
                      )}
                    </div>
                  </TooltipProvider>
                  <div className={"flex flex-row justify-end"}>
                    <Button variant={"outline"} onClick={onClose}>
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default RepositoryInformation
