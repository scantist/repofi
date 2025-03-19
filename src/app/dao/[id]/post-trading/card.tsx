"use client"

import CardWrapper from "~/components/card-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { type DaoDetailResult } from "~/server/service/dao"
import PostTradingForm from "~/app/dao/[id]/post-trading/form"
import { cn } from "~/lib/utils"

interface TradingCardProps {
  data: DaoDetailResult;
}

const PostTradingCard = ({ data }: TradingCardProps) => {
  return (
    <CardWrapper>
      <div className={"relative overflow-clip rounded-lg backdrop-blur"}>
        <a
          className={cn(
            "absolute -right-8 top-6 flex h-6 w-30 rotate-45 items-center bg-gray-400/20 text-[10px]",
            "justify-center text-center hover:text-primary-foreground cursor-pointer font-bold")
          }
        >
          Uniswap V3
        </a>
        <Tabs defaultValue="buy" className={"rounded-lg px-5 py-6"}>
          <div className={"w-full px-6"}>
            <CardWrapper className={"w-full"}>
              <TabsList
                className={
                  "text-md flex w-full flex-row items-center justify-around"
                }
              >
                <TabsTrigger
                  value="buy"
                  className={
                    "dark:data-[state=active]:bg-secondary w-full flex-1 cursor-pointer rounded-lg py-2 text-center"
                  }
                >
                  Buy
                </TabsTrigger>
                <TabsTrigger
                  value="sell"
                  className={
                    "dark:data-[state=active]:bg-secondary w-full flex-1 cursor-pointer rounded-lg py-2 text-center"
                  }
                >
                  Sell
                </TabsTrigger>
              </TabsList>
            </CardWrapper>
          </div>

          <TabsContent value="buy" className="w-full">
            <PostTradingForm data={data} mode="buy" />
          </TabsContent>
          <TabsContent value="sell" className="w-full">
            <PostTradingForm data={data} mode="sell" />
          </TabsContent>
        </Tabs>
      </div>
    </CardWrapper>
  )
}
export default PostTradingCard
