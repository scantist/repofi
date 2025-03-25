"use client"
import CardWrapper from "~/components/card-wrapper"
import { type ContributorPage } from "~/server/service/contributor"
import { api } from "~/trpc/react"
import { type DaoDetailResult } from "~/server/service/dao"
import { shortenAddress } from "~/lib/web3"

interface ContributorCardProps {
  initContributorList?: ContributorPage
  dao: DaoDetailResult
}

const ContributorCard = ({ initContributorList, dao }: ContributorCardProps) => {
  const { data } = api.contributor.getContributors.useQuery(
    {
      page: 0,
      size: 10,
      daoId: dao.id
    },
    {
      initialData: initContributorList
    }
  )
  return (
    <CardWrapper contentClassName={"min-h-95"}>
      <div className={"rounded-lg bg-black/60 p-4"}>
        <div className={"text-2xl font-medium flex flex-row justify-between items-center"}>
          <div>Contributor List</div>
          <div className={"text-sm cursor-pointer text-muted-foreground"}>Bind</div>
        </div>
        <div className={"mt-3 flex flex-col gap-2"}>
          {data?.list.map((item, index) => (
            <div key={`Contributor-${item.id}`} className={"flex flex-row items-center justify-between gap-2 font-thin"}>
              <div className={"flex flex-row items-center gap-2"}>
                <img src={item.userPlatformAvatar} className={"size-6 rounded-full"} alt={"avatar"} />
                <div className={"flex flex-col"}>
                  <div className={"flex-1 truncate"}>{item.userPlatformName}</div>
                </div>
                {item.userAddress !== null ? (
                  <div className={"text-muted-foreground text-xs"}>{shortenAddress(item.userAddress)}</div>
                ) : (
                  <div className={"text-muted-foreground text-xs cursor-pointer"}></div>
                )}
              </div>
              <div className={"bg-primary ml-4 rounded-lg px-2 py-1 text-right text-xs opacity-80"}>{Number(item.snapshotValue).toFixed(2)}%</div>
            </div>
          ))}
        </div>
      </div>
    </CardWrapper>
  )
}

export default ContributorCard
