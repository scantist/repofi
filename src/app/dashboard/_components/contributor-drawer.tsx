"use client"
import type React from "react"
import { useMemo } from "react"
import { useState } from "react"
import LoadingSpinner from "~/app/_components/loading-spinner"
import { Button } from "~/components/ui/button"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from "~/components/ui/drawer"
import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from "~/components/ui/pagination"
import useMediaQuery from "~/hooks/use-media-query"
import { defaultChain, shortenAddress } from "~/lib/web3"
import { api } from "~/trpc/react"

export const ContributorItem = ({
  item,
  userAddress,
}: { item: { userPlatformAvatar: string; userPlatformName: string; userAddress: string | null; snapshotValue: string }; userAddress?: string }) => {
  return (
    <div className={"flex flex-row items-center justify-between gap-2 font-thin"}>
      <div className={"flex flex-row items-center gap-2"}>
        <img src={item.userPlatformAvatar} className={"size-6 rounded-full"} alt={"avatar"} />
        <div className={"flex flex-c-ol"}>
          <div className={"flex-1 truncate"}>{item.userPlatformName}</div>
        </div>
        {item.userAddress !== null ? (
          <a
            href={`${defaultChain.blockExplorers.default.url}/address/${item.userAddress}`}
            className={"text-muted-foreground text-xs hover:text-white transition-colors cursor-pointer"}
            target="_blank"
            rel="noopener noreferrer"
          >
            {shortenAddress(item.userAddress)}
          </a>
        ) : (
          <div className={"text-muted-foreground text-xs cursor-pointer"} />
        )}
        {userAddress && item.userAddress === userAddress && <div className={"border border-primary rounded-lg text-xs px-2 py-1 text-secondary font-bold"}>You</div>}
      </div>
      <div className={"bg-primary ml-4 rounded-lg px-2 py-1 text-right text-xs opacity-80"}>{Number(item.snapshotValue).toFixed(2)}%</div>
    </div>
  )
}

const ContributorDrawer = ({ daoId, children, userAddress }: { daoId: string; children: React.ReactNode; userAddress?: string }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const pageSize = isDesktop ? 15 : 10

  const [page, setPage] = useState(0)

  const { data: contributorsResponse, isPending } = api.contributor.getContributors.useQuery({
    daoId: daoId,
    page: page,
    size: pageSize
  })
  const totalPages = useMemo(() => {
    if (!contributorsResponse) {
      return 0
    }
    return contributorsResponse.pages
  }, [contributorsResponse])
  return (
    <Drawer direction={isDesktop ? "right" : "bottom"}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className={isDesktop ? "inset-x-auto bottom-2 right-2 top-2 mt-auto w-[400px] overflow-y-auto rounded-[10px] after:hidden" : ""}>
        <DrawerHeader>
          <DrawerTitle className="flex justify-between px-2 text-left text-primary">Contributor Rank</DrawerTitle>
          <DrawerDescription className="sr-only">List of contributor that the repo.</DrawerDescription>
        </DrawerHeader>
        <div className={"overflow-auto px-6 py-4"}>
          {isPending && <LoadingSpinner size={64} className="my-8" text="Loading contributor..." />}
          {!isPending &&
            (contributorsResponse?.list?.length ?? 0) > 0 &&
            contributorsResponse?.list.map((item, index) => <ContributorItem key={`Contributor-list-${item.id}-${index}`} item={item} userAddress={userAddress} />)}
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

export default ContributorDrawer
