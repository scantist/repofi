"use client"
import { getCookie } from "cookies-next"
import { useSession } from "next-auth/react"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { toast } from "sonner"
import LoadingSpinner from "~/app/_components/loading-spinner"
import { useDaoContext } from "~/app/dao/[id]/context"
import ContributorDrawer, { ContributorItem } from "~/app/dashboard/_components/contributor-drawer"
import CardWrapper from "~/components/card-wrapper"
import NoData from "~/components/no-data"
import { Button } from "~/components/ui/button"
import { defaultChain, shortenAddress } from "~/lib/web3"
import { api } from "~/trpc/react"

const ContributorCard = () => {
  const githubToken = getCookie("github_token") as string | undefined
  const { detail } = useDaoContext()
  const { data: contributorsResponse, isPending } = api.contributor.getContributors.useQuery(
    {
      daoId: detail.id,
      page: 0,
      size: 10
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
      <div className={"rounded-lg bg-black/60 p-4 flex flex-col h-full"} style={{ minHeight: "inherit" }}>
        <div className={"text-xl font-medium flex flex-row justify-between items-center"}>
          <div className={"font-bold"}>Contributor Rank</div>
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
        <div className={"mt-3 flex flex-col gap-2 flex-1"}>
          {isPending ? (
            <LoadingSpinner size={64} className={"mt-10"} />
          ) : contributorsResponse?.list?.length === 0 ? (
            <NoData className={"mt-10"} size={65} textClassName={"text-xl"} text={"There's no contributors yet."} />
          ) : (
            contributorsResponse?.list?.map((item, index) => <ContributorItem key={`Contributor-${item.id}-${index}`} item={item} ownerData={ownerData} />)
          )}
        </div>
        {(contributorsResponse?.total ?? 0) > 10 && (
          <ContributorDrawer daoId={detail.id}>
            <Button variant={"outline"} className={"w-32 mx-auto"}>
              View All
            </Button>
          </ContributorDrawer>
        )}
      </div>
    </CardWrapper>
  )
}

export default ContributorCard
