"use client"

import { PostProgress, PreProgress } from "~/app/dao/[id]/_components/data-progress"
import GraduatedChart from "~/app/dao/[id]/_components/graduated-chart"
import MessageList from "~/app/dao/[id]/message/message-list"
import PostTradingCard from "~/app/dao/[id]/post-trading/card"
import TradingCard from "~/app/dao/[id]/trading/card"
import ContributorCard from "~/app/dashboard/_components/contributor-card"
import CardWrapper from "~/components/card-wrapper"
import NoData from "~/components/no-data"
import TradeView from "~/components/trade-view"
import { shortenAddress } from "~/lib/web3"
import { defaultChain } from "~/lib/web3"
import type { ContributorPage } from "~/server/service/contributor"
import type { DaoDetailResult } from "~/server/service/dao"
import type { Top10Holders } from "~/server/service/holder"

interface DaoContentProps {
  data: DaoDetailResult
  initContributorList: ContributorPage
  top10Holders: Top10Holders
}

const DaoContent = ({ data, initContributorList, top10Holders }: DaoContentProps) => {
  const graduated = data.tokenInfo.isGraduated
  const progress = 20
  return (
    <div className={"my-10 grid w-full grid-cols-1 gap-8 md:grid-cols-3"}>
      <div className={"col-span-1 flex flex-col gap-4 md:col-span-2"}>
        <CardWrapper>
          <div className={"flex flex-row justify-between rounded-lg bg-black/50 px-12 py-3"}>
            <div className={"text-center"}>
              <div className={"text-sm font-thin"}>Token Id</div>
              <div className={"mt-2 text-xl"}>{data?.tokenId}</div>
            </div>
            <div className={"max-w-max text-center"}>
              <div className={"text-sm font-thin"}>Market Cap</div>
              <div className={"mt-2 text-xl"}>{data?.marketCapUsd}</div>
            </div>
            <div className={"text-center"}>
              <div className={"text-sm font-thin"}>Created By</div>
              <a
                href={`${defaultChain.blockExplorers.default.url}/address/${data?.createdBy}`}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block underline hover:no-underline"
              >
                {shortenAddress(data?.createdBy ?? "")}
              </a>
            </div>
            <div className={"text-center"}>
              <div className={"text-sm font-thin"}>Token Address</div>
              {data?.tokenInfo?.tokenAddress ? (
                <a
                  href={`${defaultChain.blockExplorers.default.url}/address/${data.tokenInfo.tokenAddress}`}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 block underline hover:no-underline"
                >
                  {shortenAddress(data.tokenInfo.tokenAddress)}
                </a>
              ) : (
                <span className="mt-2 block">UnLaunch</span>
              )}
            </div>
          </div>
          <div className={"flex flex-row gap-4 px-12 py-3 border-t-primary border-t"}>{graduated ? <PostProgress dao={data} /> : <PreProgress dao={data} />}</div>
        </CardWrapper>
        <CardWrapper contentClassName={"h-[360px]"}>
          {graduated ? (
            <GraduatedChart uniswapV3Pair={data.tokenInfo.uniswapV3Pair} />
          ) : (
            <TradeView
              dao={{
                tokenId: data.tokenId,
                name: data.name,
                ticker: data.ticker
              }}
            />
          )}
        </CardWrapper>
        <CardWrapper>
          <MessageList data={data} />
        </CardWrapper>
      </div>
      <div className={"col-span-1 flex flex-col gap-4"}>
        {graduated ? <PostTradingCard data={data} /> : <TradingCard data={data} />}
        <ContributorCard dao={data} initContributorList={initContributorList} />
        <CardWrapper>
          <div className={"rounded-lg bg-black/60 p-4"}>
            <div className={"text-2xl font-medium"}>Token Distribution</div>
            <div className={"mt-3 flex flex-col gap-2 min-h-95"}>
              {top10Holders.length === 0 ? (
                <NoData className={"mt-10"} size={65} textClassName={"text-xl"} />
              ) : (
                <>
                  {top10Holders.map((item, index) => (
                    <div key={`Token-Distribution-${item.userAddress}`} className={"flex flex-row items-center gap-2 font-thin"}>
                      <div className={"flex-1 truncate"}>{shortenAddress(item.userAddress)}</div>
                      <div>{Number(item.balance).toFixed(2)}</div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </CardWrapper>
      </div>
    </div>
  )
}

export default DaoContent
