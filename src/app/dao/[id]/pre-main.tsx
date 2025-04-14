"use client"

import Image from "next/image"
import MessageList from "~/app/dao/[id]/message/message-list"
import ContributorCard from "~/app/dashboard/_components/contributor-card"
import CardWrapper from "~/components/card-wrapper"

interface PreMainProps {
  isOwned: boolean
}

const DEFAULT_TIP = "Please wait for the DAO owner to fundraising."

const PreMain = ({ isOwned }: PreMainProps) => {
  return (
    <div className={"my-10 grid w-full grid-cols-1 gap-8 md:grid-cols-3"}>
      <div className={"col-span-1 flex flex-col gap-4 md:col-span-2"}>
        <CardWrapper contentClassName={"w-full h-20 relative flex justify-center items-center"}>
          <Image src={"https://storage.googleapis.com/repofi-prod/launchpad/image/token_blur.png"} alt={"Token"} fill={true} />
          <div className={"z-10 px-5 lg:px-10 text-center"}>{isOwned ? "You can get token information with DAO." : DEFAULT_TIP}</div>
        </CardWrapper>
        <CardWrapper contentClassName={"w-full h-42 relative flex justify-center items-center progress"}>
          <Image src={"https://storage.googleapis.com/repofi-prod/launchpad/image/locker_blur.png"} alt={"Launch Progress"} fill={true} />
          <div className={"z-10 px-5 lg:px-10 text-center"}>
            {isOwned ? "This progress bar will reflect your fundraising progress, launch results or claim ratio." : DEFAULT_TIP}
          </div>
        </CardWrapper>
        <CardWrapper className={"flex-1"} contentClassName={"min-h-[370px] h-full max-h-none trade-view relative flex justify-center items-center trade-view"}>
          <Image src={"https://storage.googleapis.com/repofi-prod/launchpad/image/trend_blur.png"} alt={"Trend"} fill={true} />
          <div className={"z-10 px-5 lg:px-10 text-center"}>{isOwned ? "The block will show your token trends at different status." : DEFAULT_TIP}</div>
        </CardWrapper>
        <CardWrapper>
          <MessageList />
        </CardWrapper>
      </div>
      <div className={"col-span-1 flex flex-col gap-4"}>
        <CardWrapper contentClassName={"trading min-h-[431px] relative flex justify-center items-center trading"}>
          <Image src={"https://storage.googleapis.com/repofi-prod/launchpad/image/transaction_blur.png"} alt={"transaction"} fill={true} />
          <div className={"z-10 px-5 lg:px-10 text-center"}>{isOwned ? "Token transactions can be made here." : DEFAULT_TIP}</div>
        </CardWrapper>
        <CardWrapper contentClassName={"trading min-h-[431px] relative flex justify-center items-center distribution"}>
          <Image src={"https://storage.googleapis.com/repofi-prod/launchpad/image/distribution_blur.png"} alt={"Distribution"} fill={true} />
          <div className={"z-10 px-5 lg:px-10 text-center"}>{isOwned ? "When someone else buys it, it shows how much each person owns." : DEFAULT_TIP}</div>
        </CardWrapper>
        <CardWrapper contentClassName={"trading min-h-[431px] relative flex justify-center items-center distribution"}>
          <ContributorCard />
        </CardWrapper>
      </div>
    </div>
  )
}

export default PreMain
