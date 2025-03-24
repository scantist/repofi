import { defaultChain } from "~/components/auth/config"
import DextoolsChart from "~/components/dextools/chart"
import NoData from "~/components/no-data"

const GraduatedChart = ({ uniswapV3Pair }: { uniswapV3Pair?: string | null }) => {
  if (!uniswapV3Pair) {
    return (
      <div className="flex h-full items-center justify-center gap-2 text-muted-foreground">
        <NoData className={"mt-10"} size={65} textClassName={"text-xl"} />
      </div>
    )
  }

  return (
    <div className="flex h-full w-full flex-col rounded-xl overflow-clip justify-center items-center">
      <DextoolsChart pair={uniswapV3Pair} chainId={defaultChain.name.toLowerCase()} />
    </div>
  )
}

export default GraduatedChart
