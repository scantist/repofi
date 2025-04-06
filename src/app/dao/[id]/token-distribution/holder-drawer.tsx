import type React from "react"
import { useMemo, useState } from "react"
import LoadingSpinner from "~/app/_components/loading-spinner"
import { Button } from "~/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "~/components/ui/drawer"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "~/components/ui/pagination"
import useMediaQuery from "~/hooks/use-media-query"
import { formatMoney } from "~/lib/utils"
import { shortenAddress } from "~/lib/web3"
import { api } from "~/trpc/react"

const HolderItem = ({
  item,
  index,
  uniswapV3Pair,
  lockerAddress
}: {
  item: {
    userAddress: string
    tokenId: bigint
    balance: string
  }
  userAddress?: string
  index: number
  uniswapV3Pair?: string | null
  lockerAddress?: string
}) => {
  return (
    <div className={"flex flex-row items-center justify-between gap-2 font-thin"}>
      <div key={`Token-Distribution-${item.userAddress}`} className={"flex flex-row items-center gap-2 font-thin"}>
        <div className={"w-2 text-right"}>{index + 1}.</div>
        <div className={"w-35 truncate font-bold"}>{shortenAddress(item.userAddress)}</div>
        <div className={"flex flex-1 items-center gap-2"}>
          {uniswapV3Pair === item.userAddress && <div className={"border border-primary rounded-lg text-xs px-2 py-1 text-secondary font-bold"}>Uniswap V3</div>}
          {lockerAddress?.toLowerCase() === item.userAddress.toLowerCase() && (
            <div className={"border border-primary rounded-lg text-xs px-2 py-1 text-secondary font-bold"}>LOCKER</div>
          )}
        </div>
        <div className={"w-24 text-right"}>{formatMoney(item.balance ?? 0)}</div>
      </div>
    </div>
  )
}

const TokenDrawer = ({
  tokenId,
  children,
  uniswapV3Pair,
  lockerAddress
}: { tokenId: string; children: React.ReactNode; uniswapV3Pair?: string | null; lockerAddress?: string }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const pageSize = isDesktop ? 15 : 10

  const [page, setPage] = useState(0)

  const { data: holderResponse, isPending } = api.holder.getHolders.useQuery({
    tokenId,
    page: page,
    size: pageSize
  })
  const totalPages = useMemo(() => {
    if (!holderResponse) {
      return 0
    }
    return holderResponse.pages
  }, [holderResponse])
  return (
    <Drawer direction={isDesktop ? "right" : "bottom"}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className={isDesktop ? "inset-x-auto bottom-2 right-2 top-2 mt-auto w-[400px] overflow-y-auto rounded-[10px] after:hidden" : ""}>
        <DrawerHeader>
          <DrawerTitle className="flex justify-between px-2 text-left text-primary">Token Distribution</DrawerTitle>
          <DrawerDescription className="sr-only">List of token that the DAO.</DrawerDescription>
        </DrawerHeader>
        <div className={"overflow-auto px-6 py-4"}>
          {isPending && <LoadingSpinner size={64} className="my-8" text="Loading contributor..." />}
          {!isPending &&
            (holderResponse?.list?.length ?? 0) > 0 &&
            holderResponse?.list.map((item, index) => (
              <HolderItem key={`Contributor-list-${item.userAddress}-${index}`} item={item} index={index} lockerAddress={lockerAddress} uniswapV3Pair={uniswapV3Pair} />
            ))}
        </div>
        <DrawerFooter>
          <Pagination className="mb-4">
            <PaginationContent className="w-full justify-between">
              <PaginationItem>
                <PaginationPrevious
                  isActive={page > 0}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(Math.max(0, page - 1))
                  }}
                  href="#"
                />
              </PaginationItem>

              <PaginationItem className="w-20 text-center text-muted-foreground">
                <span>{page + 1}</span> / <span>{totalPages}</span>
              </PaginationItem>

              <PaginationItem>
                <PaginationNext
                  isActive={page < totalPages - 1}
                  onClick={(e) => {
                    e.preventDefault()
                    setPage(Math.min(totalPages - 1, page + 1))
                  }}
                  href="#"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
          <DrawerClose asChild>
            <Button variant="outline" size="sm" type="button">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

export default TokenDrawer
