"use client"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { toast } from "sonner"
import LoadingSpinner from "~/app/_components/loading-spinner"
import { useDaoContext } from "~/app/dao/[id]/context"
import ContributorDrawer, { ContributorItem } from "~/app/dashboard/_components/contributor-drawer"
import CardWrapper from "~/components/card-wrapper"
import NoData from "~/components/no-data"
import { Button } from "~/components/ui/button"
import { api } from "~/trpc/react"

const ContributorCard = () => {
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
  const { data: session } = useSession()
  const searchParams = useSearchParams()
  const error = searchParams.get("error")
  const errorDescription = searchParams.get("error_description")
  useEffect(() => {
    if (error) {
      toast.error(`Authorization Error: ${error}, ${errorDescription}`, { duration: 10000, closeButton: true })
    }
  }, [error, errorDescription])
  return (
    <CardWrapper contentClassName={"min-h-95 contributor"}>
      <div className={"rounded-lg bg-black/60 p-4 flex flex-col h-full"} style={{ minHeight: "inherit" }}>
        <div className={"text-xl font-medium flex flex-row justify-between items-center"}>
          <div className={"font-bold"}>Contributor Rank</div>
        </div>
        <div className={"mt-3 flex flex-col gap-2 flex-1"}>
          {isPending ? (
            <LoadingSpinner size={64} className={"mt-10"} />
          ) : contributorsResponse?.list?.length === 0 ? (
            <NoData className={"mt-10"} size={65} textClassName={"text-xl"} text={"There's no contributors yet."} />
          ) : (
            contributorsResponse?.list?.map((item, index) => <ContributorItem key={`Contributor-${item.id}-${index}`} item={item} userAddress={session?.address} />)
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
