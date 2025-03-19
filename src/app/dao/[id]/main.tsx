"use client"

import { SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import CardWrapper from "~/components/card-wrapper"
import ContributorCard from "~/app/dashboard/_components/contributor-card"
import TradingCard from "~/app/dao/[id]/trading/card"
import { type DaoDetailResult } from "~/server/service/dao"
import { shortenAddress } from "~/lib/web3"
import MessageList from "~/app/dao/[id]/message/message-list"
import PostTradingCard from "~/app/dao/[id]/post-trading/card"

interface DaoContentProps {
  data: DaoDetailResult;
}

const DaoContent = ({ data }: DaoContentProps) => {
  const graduated = data.tokenInfo.isGraduated
  return (
    <div className={"my-10 grid w-full grid-cols-1 gap-8 md:grid-cols-3"}>
      <div className={"col-span-1 flex flex-col gap-4 md:col-span-2"}>
        <CardWrapper>
          <div
            className={
              "flex flex-row justify-between rounded-lg bg-black/50 px-12 py-3"
            }
          >
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
                target="_blank"
                rel="noreferrer"
                className="mt-2 block underline hover:no-underline"
              >
                {shortenAddress(data?.createdBy ?? "")}
              </a>
            </div>
            <div className={"text-center"}>
              <div className={"text-sm font-thin"}>Token Address</div>
              <a
                target="_blank"
                rel="noreferrer"
                className="mt-2 block underline hover:no-underline"
              >
                {shortenAddress(data?.tokenInfo?.tokenAddress ?? "")}
              </a>
            </div>
          </div>
          <div className={"bg-secondary flex flex-row gap-4 px-12 py-3"}>
            <div>Capabilities</div>
            <SiTelegram />
            <SiX />
          </div>
        </CardWrapper>
        <img
          src={"https://storage.googleapis.com/repofi/launchpad/image/K.png"}
          alt={"K"}
        />
        <CardWrapper>
          <MessageList data={data} />
        </CardWrapper>
      </div>
      <div className={"col-span-1 flex flex-col gap-4"}>
        {graduated ? (
          <PostTradingCard data={data} />
        ) : (
          <TradingCard data={data} />
        )}
        <ContributorCard />
        <CardWrapper>
          <div className={"rounded-lg bg-black/60 p-4"}>
            <div className={"text-2xl font-medium"}>Token Distribution</div>
            <div className={"mt-3 flex flex-col gap-2"}>
              {Array.from({ length: 11 }, (_, i) => i).map((item, index) => (
                <div
                  key={`Contributor-${item}`}
                  className={"flex flex-row items-center gap-2 font-thin"}
                >
                  <div className={"w-6"}>{index}.</div>
                  <div className={"flex-1 truncate"}>0x5e6F...39dC</div>
                  <div>3.54%</div>
                </div>
              ))}
            </div>
          </div>
        </CardWrapper>
      </div>
    </div>
  )
}

export default DaoContent
