"use client"

import { TooltipTrigger } from "@radix-ui/react-tooltip"
import { CircleHelp, Info } from "lucide-react"
import { PostProgress, PreProgress } from "~/app/dao/[id]/_components/data-progress"
import GraduatedChart from "~/app/dao/[id]/_components/graduated-chart"
import { useDaoContext } from "~/app/dao/[id]/context"
import MessageList from "~/app/dao/[id]/message/message-list"
import PostTradingCard from "~/app/dao/[id]/post-trading/card"
import TradingCard from "~/app/dao/[id]/trading/card"
import ContributorCard from "~/app/dashboard/_components/contributor-card"
import CardWrapper from "~/components/card-wrapper"
import TradeView from "~/components/trade-view"
import { Tooltip, TooltipContent, TooltipProvider } from "~/components/ui/tooltip"
import { formatMoney } from "~/lib/utils" // 确保路径正确
import { defaultChain, shortenAddress } from "~/lib/web3"
import TokenDistribution from "./token-distribution/token-distrubution"

const DaoContent = () => {
  const { detail } = useDaoContext()
  const graduated = detail.tokenInfo.isGraduated
  return (
    <div className={"my-10 grid w-full grid-cols-1 gap-8 md:grid-cols-3"}>
      <div className={"col-span-1 flex flex-col gap-4 md:col-span-2"}>
        <CardWrapper>
          <div className={"grid grid-cols-2 sm:grid-cols-4 gap-y-4 justify-between rounded-lg bg-black/50 px-3 sm:px-12 py-3"}>
            <div className={"text-center"}>
              <div className={"text-sm font-thin"}>Token ID</div>
              <div className={"mt-2 text-xl"}>{detail.tokenId}</div>
            </div>
            <div className={"text-center"}>
              <div className={"text-sm font-thin"}>Market Cap</div>
              <div className={"mt-2 text-xl"}>{`$${formatMoney(detail.marketCapUsd)}`}</div>
            </div>
            <div className={"text-center"}>
              <div className={"text-sm font-thin"}>Created By</div>
              <a
                href={`${defaultChain.blockExplorers.default.url}/address/${detail.createdBy}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block underline hover:no-underline"
              >
                {shortenAddress(detail.createdBy ?? "")}
              </a>
            </div>
            <div className={"text-center"}>
              <div className={"text-sm font-thin"}>Token Address</div>
              {detail?.tokenInfo?.tokenAddress ? (
                <a
                  href={`${defaultChain.blockExplorers.default.url}/address/${detail.tokenInfo.tokenAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block underline hover:no-underline"
                >
                  {shortenAddress(detail.tokenInfo.tokenAddress)}
                </a>
              ) : (
                <div className="mt-2 flex flex-row gap-1 items-center justify-center">
                  <div>Pending</div>
                  <TooltipProvider delayDuration={100}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Info size={16} className={"text-muted-foreground"} />
                      </TooltipTrigger>
                      <TooltipContent className="font-semibold">Let the progress bar reach 100%! You can activate it！</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>
          <div className={"flex flex-row gap-4 px-12 py-3 border-t-primary border-t"}>{graduated ? <PostProgress /> : <PreProgress />}</div>
        </CardWrapper>
        <CardWrapper className={"flex-1"} contentClassName={"min-h-[370px] h-full max-h-none"}>
          {graduated ? (
            <GraduatedChart uniswapV3Pair={detail.tokenInfo.uniswapV3Pair} />
          ) : (
            <TradeView
              dao={{
                tokenId: detail.tokenId,
                name: detail.name,
                ticker: detail.ticker
              }}
            />
          )}
        </CardWrapper>
        <CardWrapper>
          <MessageList />
        </CardWrapper>
      </div>
      <div className={"col-span-1 flex flex-col gap-4"}>
        {graduated ? <PostTradingCard /> : <TradingCard />}
        <ContributorCard />
        <CardWrapper>
          <TokenDistribution />
        </CardWrapper>
      </div>
    </div>
  )
}

export default DaoContent
