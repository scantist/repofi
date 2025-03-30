"use client"
import { getCookie } from "cookies-next"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { toast } from "sonner"
import LoadingSpinner from "~/app/_components/loading-spinner"
import { useDaoContext } from "~/app/dao/[id]/context"
import CardWrapper from "~/components/card-wrapper"
import NoData from "~/components/no-data"
import { defaultChain, shortenAddress } from "~/lib/web3"
import { api } from "~/trpc/react"

const ContributorCard = () => {
  const githubToken = getCookie("github_token") as string | undefined
  const { detail } = useDaoContext()
  const { data: top10Contributors, isPending } = api.contributor.getTop10Contributor.useQuery(
    {
      daoId: detail.id
    },
    {
      enabled: !!detail.id
    }
  )
  const router = useRouter()
  const pathname = usePathname()
  const { data: session } = useSession()
  const { data: ownerData, isPending: isOwnerPending } = api.contributor.owner.useQuery({ daoId: detail.id })
  const { mutate, isPending: mutatePending } = api.contributor.bind.useMutation({
    onSuccess: () => {
      toast.success("Bind success!")
      console.log("githubToken", githubToken)
    },
    onError: () => {
      toast.error("Bind failed!")
    }
  })
  return (
    <CardWrapper contentClassName={"min-h-95"}>
      <div className={"rounded-lg bg-black/60 p-4"}>
        <div className={"text-2xl font-medium flex flex-row justify-between items-center"}>
          <div>Contributor Rank</div>
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
                toast.warning("Please login your GitHub account first.", {
                  action: {
                    label: "Login",
                    onClick: () => router.push(`/api/oauth/github?rollbackUrl=${pathname}`)
                  },
                  duration: 5000
                })
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
          ) : top10Contributors?.length === 0 ? (
            <NoData className={"mt-10"} size={65} textClassName={"text-xl"} text={"There's no contributors yet."} />
          ) : (
            top10Contributors?.map((item, index) => (
              <div key={`Contributor-${item.id}`} className={"flex flex-row items-center justify-between gap-2 font-thin"}>
                <div className={"flex flex-row items-center gap-2"}>
                  <img src={item.userPlatformAvatar} className={"size-6 rounded-full"} alt={"avatar"} />
                  <div className={"flex flex-col"}>
                    <div className={"flex-1 truncate"}>{item.userPlatformName}</div>
                  </div>
                  {item.userAddress !== null ? (
                    <a
                      href={`${defaultChain.blockExplorers.default.url}/address/${item.userAddress}`}
                      className={"text-muted-foreground text-xs hover:text-white transition-colors cursor-pointer"}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {shortenAddress(item.userAddress)}
                    </a>
                  ) : (
                    <div className={"text-muted-foreground text-xs cursor-pointer"} />
                  )}
                  {ownerData && item.userAddress === ownerData.userAddress && (
                    <div className={"border border-primary rounded-lg text-xs px-2 py-1 text-secondary font-bold"}>You</div>
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
