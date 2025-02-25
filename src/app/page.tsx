import BannerWrapper from "~/components/banner-wrapper"
import { Sparkles } from "lucide-react"
import {homeSearchParamsSchema} from "~/lib/schema"
import ListFilter from "~/app/_components/ListFilter"

const RootPage = async ({
  searchParams
}: {
  searchParams: Promise<{
    search: string | undefined;
    orderBy: string | undefined;
    onlyLaunched: string | null | undefined;
    owned: string | null | undefined;
    starred: string | null | undefined;
  }>;
}) => {
  const params = homeSearchParamsSchema.parse(await searchParams)

  return (
    <div className={"min-h-full mt-10"}>
      <BannerWrapper className={"flex w-full flex-col"}>
        <div
          className={
            "flex w-full flex-row items-center justify-between gap-8"
          }
        >
          <div className={"flex flex-col"}>
            <div className={"text-5xl leading-32 font-bold tracking-tight"}>
              REPO Protocol
            </div>
            <div className={"max-w-2/3"}>
              Welcome to the REPO Protocol Launchpad. Vote on the best biotech
              DAOs to join the ecosystem, and participate in bioDAO token
              auctions. Discover what&#39;s happening in the REPO Protocol
              ecosystem below!
            </div>
          </div>
          <div
            className={
              "bg-primary flex h-16 min-w-64 cursor-pointer flex-row items-center justify-center gap-3 rounded-md text-lg font-bold text-nowrap whitespace-nowrap"
            }
          >
            <Sparkles />
            <div>Create Your Dao</div>
          </div>
        </div>
        <ListFilter {...params} />
      </BannerWrapper>
    </div>
  )
}
export default RootPage
