import PortfolioTable from "~/app/portfolio/_components/portfolio-table"
import WalletButton from "~/components/auth/wallet-button"
import { auth } from "~/server/auth"
import type { DaoSearchResult } from "~/server/service/dao"
import { api } from "~/trpc/server"

const PortfolioPage = async () => {
  const session = await auth()
  const launchedDao: DaoSearchResult = await api.dao.search({
    status: ["LAUNCHED"]
  })
  return (
    <div className={"mt-20 flex-col max-w-7xl mx-auto flex min-h-full w-full px-4"}>
      <div className={"text-5xl leading-32 font-bold tracking-tight"}>My Portfolio</div>
      {session ? (
        <div>session</div>
      ) : (
        <div className={"bg-secondary rounded-lg p-5 flex flex-col gap-5"}>
          <div>Connect your wallet to see your Portfolio</div>
          <div>
            <WalletButton />
          </div>
        </div>
      )}
      <div className={"w-full my-10"}>
        <PortfolioTable daoList={launchedDao} />
      </div>
    </div>
  )
}

export default PortfolioPage
