import { Loader2, Sparkles } from "lucide-react"
import { Suspense } from "react"
import ContentFilter from "~/app/_components/content-filter"
import BannerWrapper from "~/components/banner-wrapper"
import { homeSearchParamsSchema } from "~/lib/schema"

const RootPage = async ({
  searchParams
}: {
  searchParams: Promise<{
    search: string | undefined
    orderBy: string | undefined
    onlyLaunched: string | null | undefined
    owned: string | null | undefined
    starred: string | null | undefined
  }>
}) => {
  const params = homeSearchParamsSchema.parse(await searchParams)

  return (
    <div className={"mt-10 min-h-full"}>
      <BannerWrapper className={"flex w-full flex-col"}>
        <div className={"flex w-full flex-col md:flex-row items-center justify-between gap-8"}>
          <div className={"flex flex-col"}>
            <div className={"text-5xl leading-32 font-bold tracking-tight text-center md:text-left"}>REPO Protocol</div>
            <div className={"w-full md:max-w-2/3"}>
              Welcome to the REPO Protocol Launchpad. Vote on the best biotech DAO to join the ecosystem, and participate in bioDAO token auctions. Discover what&#39;s happening in
              the REPO Protocol ecosystem below!
            </div>
          </div>
          <div className={"bg-primary flex h-16 min-w-64 cursor-pointer flex-row items-center justify-center gap-3 rounded-md text-lg font-bold text-nowrap whitespace-nowrap"}>
            <Sparkles />
            <div>Create Your Dao</div>
          </div>
        </div>
        <ContentFilter {...params} />
      </BannerWrapper>
      <div className={"mx-auto flex min-h-full w-full max-w-7xl gap-10 px-4 pt-10 pb-10"}>
        <Suspense
          fallback={
            <div className="flex min-h-96 items-center justify-center">
              <Loader2 className="size-10 animate-spin" />
            </div>
          }
        >
          {/*<DaoListLoader {...params} />*/}
        </Suspense>
      </div>
    </div>
  )
}
export default RootPage
