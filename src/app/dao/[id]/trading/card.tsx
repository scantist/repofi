"use client"

import CardWrapper from "~/components/card-wrapper"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import TradingForm from "~/app/dao/[id]/trading/form"
import { type DaoDetailResult } from "~/server/service/dao"

interface TradingCardProps {
  data: DaoDetailResult
}

const TradingCard = ({ data }: TradingCardProps) => {
  return (
    <CardWrapper>
      <Tabs defaultValue="buy" className={"rounded-lg px-5 py-6"}>
        <div className={"w-full px-6"}>
          <CardWrapper className={"w-full"}>
            <TabsList className={"text-md flex w-full flex-row items-center justify-around"}>
              <TabsTrigger value="buy" className={"dark:data-[state=active]:bg-secondary w-full flex-1 cursor-pointer rounded-lg py-2 text-center"}>
                Buy
              </TabsTrigger>
              <TabsTrigger value="sell" className={"dark:data-[state=active]:bg-secondary w-full flex-1 cursor-pointer rounded-lg py-2 text-center"}>
                Sell
              </TabsTrigger>
            </TabsList>
          </CardWrapper>
        </div>

        <TabsContent value="buy" className="w-full">
          <TradingForm data={data} mode="buy" />
        </TabsContent>
        <TabsContent value="sell" className="w-full">
          <TradingForm data={data} mode="sell" />
        </TabsContent>
      </Tabs>
    </CardWrapper>
  )
}
export default TradingCard
