"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  type FC,
  useOptimistic,
  useState,
  useTransition
} from "react"
import SearchInput from "~/components/ui/search-input"
import { type HomeSearchParams } from "~/lib/schema"
import { useAuth } from "~/components/auth/auth-context"
import Switcher from "~/components/ui/switcher"
import Sorter from "~/app/_components/content-filter-sort"

const ContentFilter: FC<HomeSearchParams> = ({
  owned,
  starred,
  search,
  orderBy
}) => {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [searchValue, setSearchValue] = useOptimistic(search)
  const [orderByValue, setOrderByValue] = useOptimistic(orderBy)
  const [ownedValue, setOwnedValue] = useOptimistic(owned)
  const [starredValue, setStarredValue] = useOptimistic(starred)

  const [input, setInput] = useState(searchValue ?? "")
  const [isPending, startTransition] = useTransition()

  const { isAuthenticated } = useAuth()

  const updateValue = <T,>(
    value: T,
    key: string,
    set: (action: T | ((pendingState: T) => T)) => void,
  ) => {
    const newSearchParams = new URLSearchParams(searchParams)
    if (!value) {
      newSearchParams.delete(key)
    } else {
      newSearchParams.set(key, String(value))
    }
    startTransition(() => {
      set(value)
      router.push(`?${newSearchParams.toString()}`, { scroll: false })
    })
  }
  return (
    <div
      className={
        "bg-background/40 top-16 z-10 grid grid-cols-1 items-center gap-8 rounded-lg border p-3.5 backdrop-blur sm:grid-cols-2 md:sticky lg:grid-cols-7"
      }
    >
      <div className="lg:col-span-2">
        <SearchInput
          input={input}
          setInput={setInput}
          handleSearchChange={(value: string) => {
            updateValue(value, "search", setSearchValue)
          }}
          searchValue={searchValue ?? ""}
        />
      </div>
      <div className="ml-4 flex flex-wrap items-center gap-5 md:flex-nowrap lg:col-span-3">
        {isAuthenticated && (
          <>
            <Switcher
              value={ownedValue}
              label="Holding"
              handleChange={(value) => {
                updateValue(value, "owned", setOwnedValue)
              }}
            />
            <Switcher
              value={starredValue}
              label="Starred"
              handleChange={(value) => {
                updateValue(value, "starred", setStarredValue)
              }}
            />
          </>
        )}
      </div>
      <Sorter
        className="w-full lg:col-span-2"
        sortByValue={orderByValue}
        handleOrderChange={(value) => {
          updateValue(value, "orderBy", setOrderByValue)
        }}
      />
    </div>
  )
}
export default ContentFilter
