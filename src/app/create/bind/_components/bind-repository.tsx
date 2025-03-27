"use client"

import {SiGithub} from "@icons-pack/react-simple-icons"
import {DaoPlatform} from "@prisma/client"
import {deleteCookie} from "cookies-next"
import {useAtom} from "jotai"
import {Eye, GitFork, LogOut, Search, Star, Users} from "lucide-react"
import {motion} from "motion/react"
import {useSession} from "next-auth/react"
import {useRouter} from "next/navigation"
import type React from "react"
import {type FC, useEffect, useId, useRef, useState} from "react"
import {toast} from "sonner"
import LoadingSpinner from "~/app/_components/loading-spinner"
import RepositoryInformation from "~/app/create/bind/_components/repository-information"
import CardWrapper from "~/components/card-wrapper"
import ListPagination from "~/components/list-pagination"
import {Button} from "~/components/ui/button"
import {Input} from "~/components/ui/input"
import {useOutsideClick} from "~/hooks/use-outside-click"
import type {Pageable} from "~/lib/schema"
import {cn} from "~/lib/utils"
import {daoFormsAtom} from "~/store/create-dao-store"
import {api} from "~/trpc/react"
import type {Repository} from "~/types/data"
import BindRepositoryEmpty from "./bind-repository-empty"

type Props = {
  githubToken?: string
}

type Condition = {
  name: string
  pageable: Pageable
}

const BindRepository: FC<Props> = ({githubToken}) => {
  const [active, setActive] = useState<Repository | null>(null)
  const [current, setCurrent] = useState<Repository | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()
  const router = useRouter()
  const [daoForms, setDaoForms] = useAtom(daoFormsAtom)
  const {data: session} = useSession()
  const [condition, setCondition] = useState<Condition>({
    name: "",
    pageable: {
      page: 0,
      size: 6
    }
  })
  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () => setActive(null))

  const {data: repoResponse, isPending} = api.repo.fetchPublicRepos.useQuery(
    {
      accessToken: githubToken,
      platform: DaoPlatform.GITHUB,
      search: condition.name,
      pageable: {...condition.pageable}
    },
    {enabled: !!githubToken}
  )
  const {data: info} = api.repo.fetchPlatformInfo.useQuery(
    {accessToken: githubToken, platform: DaoPlatform.GITHUB},
    {
      enabled: !!githubToken,
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false
    }
  )
  const {data: currentDao, isLoading: isLoadingDao} = api.dao.findByUrl.useQuery(
    {url: current?.url ?? ""},
    {
      enabled: !!current?.url,
    }
  );

  useEffect(() => {
    if (!current || isLoadingDao) {
      return;
    }
    if (currentDao) {
      console.log("dao exists");
      toast.warning(`The ${current.name} dao already exists! Please select another.`);
    } else {
      setDaoForms({
        ...daoForms,
        url: current.url
      });
      router.push("/create/information");
    }
  }, [current, currentDao, isLoadingDao,]);

  if (!session || !githubToken) {
    return (
      <CardWrapper className={"col-span-1 w-auto md:col-span-2 max-h-fit"}>
        <BindRepositoryEmpty githubToken={githubToken}/>
      </CardWrapper>
    )
  }

  const handleSearch = () => {
    setCondition((prev) => ({...prev, page: 0}))
  }

  return (
    <CardWrapper className={"col-span-1 w-auto md:col-span-2 max-h-fit"}>
      <div className={"flex flex-col items-center justify-center gap-4 py-8 rounded-lg"}>
        <div className={"flex w-full flex-row items-center justify-between px-10"}>
          <div className={"flex flex-row gap-x-3"}>
            <SiGithub/>
            <div>
              {info?.username}
              {info?.email && (
                <>
                  {" - "}
                  {info.email}
                </>
              )}
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
            value={condition.name}
            onChange={(e) => setCondition(prev => ({...prev, name: e.target.value}))}
            className="border-primary flex-grow"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearch()
              }
            }}
          />
          <Button onClick={handleSearch}>
            <Search className="mr-2 h-4 w-4"/>
          </Button>
        </div>
        <RepositoryInformation id={id} repo={active} ref={ref} onClose={() => setActive(null)}/>
        {isPending ? (
          <LoadingSpinner size={64} className="my-8" text="Loading repository..."/>
        ) : (
          <div className={"flex w-full flex-col gap-4"}>
            {repoResponse?.list.map((repo, index) => (
              <motion.div
                layoutId={`card-${repo.name}-${id}`}
                key={`card-${repo.name}-${id}`}
                className={cn("mx-10 my-2 flex flex-col gap-2 border-b border-b-neutral-400 px-4 py-2 pb-4 transition")}
              >
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
                <div className={"flex flex-row items-center justify-between"}>
                  <motion.div className={"flex cursor-pointer flex-row items-center gap-x-2 font-thin"} onClick={() => setActive(repo)}>
                    <Users className={"size-4"} />
                    Contributors
                  </motion.div>
                  <div className={"flex flex-row gap-4"}>
                    <div
                      className={cn("cursor-pointer overflow-hidden font-bold whitespace-nowrap flex items-center h-6", current === repo && "text-primary")}
                      onClick={() => {
                        setCurrent(repo)
                      }}
                    >
                      {isLoadingDao && current === repo ? (
                        <LoadingSpinner size={16} className="mr-1" textClassName={"hidden"}/>
                      ) : (
                        "Bind"
                      )}
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
                setCondition({...condition, pageable})
              }}
            />
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

export default BindRepository
