import { Provider } from "jotai"
import { Rocket, Sparkle } from "lucide-react"
import type React from "react"
import Step from "~/app/create/_components/Step"
import BannerWrapper from "~/components/banner-wrapper"
import CardWrapper from "~/components/card-wrapper"
import createDaoStore from "~/store/create-dao-store"

const CreateLayout = async ({ children }: Readonly<{ children: React.ReactNode }>) => {
  return (
    <Provider store={createDaoStore}>
      <div className={"mt-10 min-h-full"}>
        <BannerWrapper className={"flex w-full flex-col pb-20"}>
          <div className={"items-left mt-10 flex w-full flex-col justify-between text-4xl font-bold tracking-tight md:text-left"}>Create Dao</div>
          <div className={"max-w-2xl text-sm"}>
            Utilize our platform to establish your own decentralized autonomous organization. Define your DAO&#39;s purpose, set up governance structures, and engage with your
            community. Leverage our tools to create smart contracts, initialize your DAO&#39;s ERC20 token, and foster a vibrant ecosystem.
          </div>
        </BannerWrapper>
        <div className={"mx-4 md:mx-auto my-10 grid max-w-7xl grid-cols-1 gap-8 md:grid-cols-3"}>
          <div className={"col-span-1 flex flex-col gap-y-4"}>
            <Step />
            <CardWrapper className={""}>
              <div className={"flex flex-col gap-y-5 px-11 py-10"}>
                <div className={"flex flex-row gap-x-4"}>
                  <Sparkle />
                  <div className={"text-2xl"}>Funding</div>
                </div>
                <div className={"text-md font-thin text-gray-400"}>
                  Kickstart your DAO by gathering funds from the community. Sell your DAO&#39;s ERC20 tokens on a bonding curve via REPO Protocol encouraging early adopters to
                  participate. Your DAO agent will autonomously engage with the community via the message board, fostering a dynamic and interactive funding process.
                </div>
                <div className={"text-md font-thin text-gray-400"}>Capabilities</div>
                <div className={"mt-10 flex flex-row gap-x-4"}>
                  <Rocket />
                  <div className={"text-2xl"}>Launch</div>
                </div>
                <div className={"text-md font-thin text-gray-400"}>
                  Upon successful funding and reaching the launch point, your DAO will transcend into a fully-featured entity. Unlock new capabilities and see your token listed on
                  Uniswap V2 on the Base network, enabling broader trading and liquidity.
                </div>
                <div className={"text-md font-thin text-gray-400"}>Capabilities</div>
              </div>
            </CardWrapper>
          </div>
          {children}
        </div>
      </div>
    </Provider>
  )
}

export default CreateLayout
