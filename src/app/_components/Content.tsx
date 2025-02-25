"use client"

import { type FC } from "react"
import type { HomeSearchParams } from "~/lib/schema"
import { getDaoListAction } from "~/app/actions"
import { useSuspenseInfiniteQuery } from "@tanstack/react-query"
import { Fragment, useEffect, useMemo } from "react"
import { useInView } from "react-intersection-observer"

const Content: FC<HomeSearchParams> = (props) => {
  const { ref, inView } = useInView()

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    useSuspenseInfiniteQuery({
      initialPageParam: 0,
      queryKey: ["agents-list", props],
      queryFn: ({ pageParam }) =>
        getDaoListAction({
          page: pageParam ?? 0,
          ...props
        }),
      refetchInterval: 1000 * 30,
      getNextPageParam: (nextPage) => {
        return nextPage?.nextPage
      }
    })

  useEffect(() => {
    if (inView) {
      void fetchNextPage()
    }
  }, [fetchNextPage, inView])

  const hasData = useMemo(() => {
    if (data) {
      return data.pages.some((page) => page.data && page.data.length > 0)
    } else {
      return false
    }
  }, [data])

  return (
    <div className="flex flex-col gap-10 pb-20">
      <div className="relative grid grid-cols-1 gap-4 md:grid-cols-2 md:px-2 xl:grid-cols-3">
        {data.pages.map((data, pageIndex) => {
          return (
            <Fragment key={pageIndex}>
              data
              {/*{data.data.map((agent) => (*/}
              {/*  <div>test</div>*/}
              {/*))}*/}
            </Fragment>
          )
        })}
      </div>
      <div
        ref={ref}
        className="flex items-center justify-center gap-2 text-muted-foreground"
      >
        {!hasData ? (
          <p>It looks like there is no agent yet.</p>
        ) : isFetchingNextPage ? (
          <p>Loading more...</p>
        ) : !hasNextPage && data.pages.length === 1 ? (
          ""
        ) : (
          <p>No more agents.</p>
        )}
      </div>
    </div>
  )
}

export default Content
