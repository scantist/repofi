import type React from "react"
import { useEffect } from "react"
import LoadingSpinner from "~/app/_components/loading-spinner"
import { useDaoContext } from "~/app/dao/[id]/context"
import TokenDrawer from "~/app/dao/[id]/token-distribution/holder-drawer"
import ContributorDrawer from "~/app/dashboard/_components/contributor-drawer"
import NoData from "~/components/no-data"
import { Button } from "~/components/ui/button"
import { useTokenLockerAddress } from "~/hooks/use-launch-contract"
import { formatMoney } from "~/lib/utils"
import { shortenAddress } from "~/lib/web3"
import { api } from "~/trpc/react"

const TokenDistribution: React.FC = () => {
  const { detail, refresh } = useDaoContext()
  const { address: lockerAddress } = useTokenLockerAddress()
  const {
    data: holderResponse,
    isPending,
    refetch: refetchTop10Holders
  } = api.holder.getHolders.useQuery(
    {
      tokenId: detail.tokenId.toString(),
      page: 0,
      size: 10
    },
    {
      enabled: !!detail.tokenId
    }
  )
  useEffect(() => {
    refetchTop10Holders()
  }, [refresh, refetchTop10Holders])

  return (
    <div className={"rounded-lg bg-black/60 p-4"}>
      <div className={"text-xl font-bold"}>Token Distribution</div>
      <div className={"mt-3 flex flex-col gap-2 min-h-95"}>
        {isPending ? (
          <LoadingSpinner size={64} className="my-8" />
        ) : holderResponse?.list?.length === 0 ? (
          <NoData className={"mt-10"} size={65} textClassName={"text-xl"} text={"There's no holder yet."} />
        ) : (
          <>
            {holderResponse?.list?.map((item, index) => (
              <div key={`Token-Distribution-${item.userAddress}`} className={"flex flex-row items-center gap-2 font-thin"}>
                <div className={"w-2 text-right"}>{index + 1}.</div>
                <div className={"w-35 truncate font-bold"}>{shortenAddress(item.userAddress)}</div>
                <div className={"flex flex-1 items-center gap-2"}>
                  {detail.tokenInfo.uniswapV3Pair === item.userAddress && (
                    <div className={"border border-primary rounded-lg text-xs px-2 py-1 text-secondary font-bold"}>Uniswap V3</div>
                  )}
                  {lockerAddress?.toLowerCase() === item.userAddress.toLowerCase() && (
                    <div className={"border border-primary rounded-lg text-xs px-2 py-1 text-secondary font-bold"}>LOCKER</div>
                  )}
                </div>
                <div className={"w-24 text-right"}>{formatMoney(item.balance ?? 0)}</div>
              </div>
            ))}
          </>
        )}
      </div>
      {(holderResponse?.total ?? 0) > 10 && (
        <TokenDrawer tokenId={detail.tokenId.toString()} uniswapV3Pair={detail.tokenInfo.uniswapV3Pair} lockerAddress={lockerAddress}>
          <Button variant={"outline"} className={"w-32 mx-auto"}>
            View All
          </Button>
        </TokenDrawer>
      )}
    </div>
  )
}

export default TokenDistribution
