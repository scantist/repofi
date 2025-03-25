"use client"
import { useSession } from "next-auth/react"
import LiveTable from "~/app/_components/live-table"
import WalletButton from "~/components/auth/wallet-button"

const PortfolioPage = () => {
  const { data } = useSession()
  console.log(data)
  return (
    <div className={"mt-20 flex-col max-w-7xl mx-auto flex min-h-full w-full px-4"}>
      <div className={"text-5xl leading-32 font-bold tracking-tight"}>My Portfolio</div>
      {data ? (
        <LiveTable
          initialParams={{
            owned: true,
            orderBy: "latest",
            starred: false
          }}
        />
      ) : (
        <div className={"bg-secondary rounded-lg p-5 flex flex-col gap-5"}>
          <div>Connect your wallet to see your Portfolio</div>
          <div>
            <WalletButton />
          </div>
        </div>
      )}
    </div>
  )
}

export default PortfolioPage
