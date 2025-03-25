"use client"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import { toast } from "sonner"
import LoadingSpinner from "~/app/_components/loading-spinner"
import CardWrapper from "~/components/card-wrapper"
import { shortenAddress } from "~/lib/web3"
import type { ContributorPage } from "~/server/service/contributor"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/react"

interface ContributorCardProps {
  initContributorList?: ContributorPage
  dao: DaoDetailResult
  githubToken?: string
}

const ContributorCard = ({ initContributorList, dao, githubToken }: ContributorCardProps) => {
  const { data, isPending } = api.contributor.getContributors.useQuery(
    {
      page: 0,
      size: 10,
      daoId: dao.id
    },
    {
      initialData: initContributorList
    }
  )
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()

  const { mutate, isPending: mutatePending } = api.contributor.bind.useMutation({
    onSuccess: () => {
      toast.success("Bind success!")
    },
    onError: () => {
      toast.error("Bind failed!")
    }
  })
  return (
    <CardWrapper contentClassName={"min-h-95"}>
      <div className={"rounded-lg bg-black/60 p-4"}>
        <div className={"text-2xl font-medium flex flex-row justify-between items-center"}>
          <div>Contributor List</div>
          <div
            className={"text-sm cursor-pointer text-muted-foreground"}
            onClick={() => {
              if (mutatePending) {
                return
              }
              if (!session) {
                toast.warning("Please connect your wallet.")
                return
              }
              if (!githubToken) {
                toast.warning("Please login your GitHub account first. Will link to GitHub to login after 3 seconds.")
                setTimeout(() => {
                  router.push(`/api/oauth/github?rollbackUrl=${pathname}`)
                }, 3000)
              } else {
                mutate({
                  accessToken: githubToken,
                  platform: "GITHUB"
                })
              }
            }}
          >
            {mutatePending ? "Loading..." : "Bind"}
          </div>
        </div>
        <div className={"mt-3 flex flex-col gap-2"}>
          {isPending ? (
            <LoadingSpinner size={64} className={"mt-10"} />
          ) : (
            data?.list.map((item, index) => (
              <div key={`Contributor-${item.id}`} className={"flex flex-row items-center justify-between gap-2 font-thin"}>
                <div className={"flex flex-row items-center gap-2"}>
                  <img src={item.userPlatformAvatar} className={"size-6 rounded-full"} alt={"avatar"} />
                  <div className={"flex flex-col"}>
                    <div className={"flex-1 truncate"}>{item.userPlatformName}</div>
                  </div>
                  {item.userAddress !== null ? (
                    <div className={"text-muted-foreground text-xs"}>{shortenAddress(item.userAddress)}</div>
                  ) : (
                    <div className={"text-muted-foreground text-xs cursor-pointer"} />
                  )}
                </div>
                <div className={"bg-primary ml-4 rounded-lg px-2 py-1 text-right text-xs opacity-80"}>{Number(item.snapshotValue).toFixed(2)}%</div>
              </div>
            ))
          )}
        </div>
      </div>
    </CardWrapper>
  )
}

export default ContributorCard
