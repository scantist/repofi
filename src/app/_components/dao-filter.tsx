"use client"

import { Loader2, Search, TextSearch } from "lucide-react"
import { Input } from "~/components/ui/input"
import { useCallback, type FC, useOptimistic, startTransition, useState, useEffect, useTransition } from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "~/components/ui/popover"
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group"
import { Switch } from "~/components/ui/switch"
import { Label } from "~/components/ui/label"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { type HomeSearchParams } from "~/lib/schema"
import { cn } from "~/lib/utils"

interface Props {
  title: string;
  prefix?: string;
  daoParam: HomeSearchParams;
}

const DaoFilter: FC<Props> = ({ title, prefix = "", daoParam }) => {
  // 使用普通的 useState 来跟踪输入框的值
  const [inputValue, setInputValue] = useState(daoParam.search || "")
  
  // 添加过渡状态
  const [isPending, startTransitionEffect] = useTransition()
  
  // 使用 useOptimistic 来处理乐观更新
  const [searchValue, setSearchValue] = useOptimistic(daoParam.search)
  const [orderByValue, setOrderByValue] = useOptimistic(daoParam.orderBy)
  const [ownedValue, setOwnedValue] = useOptimistic(daoParam.owned)
  const [starredValue, setStarredValue] = useOptimistic(daoParam.starred)

  // 当 daoParam.search 变化时更新输入框的值
  useEffect(() => {
    if (daoParam.search !== undefined) {
      setInputValue(daoParam.search)
    }
  }, [daoParam.search])

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      params.set(`${prefix}${name}`, value)

      return params.toString()
    },
    [searchParams, prefix],
  )

  // 更新路由但不滚动到顶部的辅助函数
  const updateRouteWithoutScroll = useCallback(
    (queryString: string) => {
      router.push(`${pathname}?${queryString}`, { scroll: false })
    },
    [router, pathname],
  )

  const handleOrderByChange = (value: string) => {
    startTransitionEffect(() => {
      setOrderByValue(value as "marketCap" | "latest")
      const queryString = createQueryString("orderBy", value)
      updateRouteWithoutScroll(queryString)
    })
  }

  const handleOwnedChange = (checked: boolean) => {
    startTransitionEffect(() => {
      setOwnedValue(checked)
      const queryString = createQueryString("owned", checked.toString())
      updateRouteWithoutScroll(queryString)
    })
  }

  const handleStarredChange = (checked: boolean) => {
    startTransitionEffect(() => {
      setStarredValue(checked)
      const queryString = createQueryString("starred", checked.toString())
      updateRouteWithoutScroll(queryString)
    })
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 直接更新输入框的值，不进行乐观更新
    setInputValue(e.target.value)
  }

  const handleSearchSubmit = () => {
    startTransitionEffect(() => {
      // 提交搜索时更新乐观状态
      setSearchValue(inputValue)
      const queryString = createQueryString("search", inputValue)
      window.dispatchEvent(new CustomEvent("daoGridLoading", { detail: { loading: true } }))
      updateRouteWithoutScroll(queryString)
    })
  }

  return (
    <div
      className={
        "flex flex-col items-center gap-4 md:flex-row md:justify-between"
      }
    >
      <div className={"text-4xl font-bold"}>{title}</div>
      <div
        className={
          "relative flex w-full flex-row items-center gap-2 md:w-72"
        }
      >
        <Popover>
          <PopoverTrigger>
            <div
              className={cn(
                "text-muted-foreground bg-card border-primary hover:text-foreground h-10 cursor-pointer rounded-lg border-1 p-2 transition",
                isPending && "opacity-70"
              )}
            >
              <TextSearch className={cn(isPending && "animate-pulse")} />
            </div>
          </PopoverTrigger>
          <PopoverContent className={"flex min-w-80 flex-col gap-6"}>
            <div className={"flex flex-row items-center"}>
              <div className={"min-w-28"}>Order By</div>
              <ToggleGroup
                type="single"
                value={orderByValue}
                onValueChange={handleOrderByChange}
                disabled={isPending}
              >
                <ToggleGroupItem
                  className={
                    "border-primary data-[state=on]:bg-primary cursor-pointer border-1"
                  }
                  value="latest"
                  aria-label="Toggle latest"
                >
                  LATEST
                </ToggleGroupItem>
                <ToggleGroupItem
                  className={
                    "border-primary data-[state=on]:bg-primary min-w-28 cursor-pointer border-1"
                  }
                  value="marketCap"
                  aria-label="Toggle market cap"
                >
                  MARKET CAP
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            <div className={"flex flex-row items-center"}>
              <Label htmlFor={"only-owned"} className={"min-w-28"}>
                Only Owned
              </Label>
              <Switch
                id="only-owned"
                checked={ownedValue === true}
                onCheckedChange={handleOwnedChange}
                disabled={isPending}
              />
            </div>
            <div className={"flex flex-row items-center"}>
              <Label htmlFor={"only-starred"} className={"min-w-28"}>
                Only Starred
              </Label>
              <Switch
                id="only-starred"
                checked={starredValue === true}
                onCheckedChange={handleStarredChange}
                disabled={isPending}
              />
            </div>
          </PopoverContent>
        </Popover>
        <div className={cn(
          "relative flex-1 transition-all duration-300",
          isPending && "opacity-80"
        )}>
          <Input
            type="text"
            placeholder="Search..."
            className={cn(
              "border-primary bg-card w-full transition-all duration-300",
              isPending && "pr-12"
            )}
            value={inputValue}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchSubmit()
              }
            }}
            disabled={isPending}
          />
          {isPending ? (
            <Loader2 className="text-primary absolute top-0 right-2 size-5 h-full animate-spin" />
          ) : (
            <Search
              className={
                "text-primary absolute top-0 right-2 size-5 h-full cursor-pointer hover:scale-110 transition-transform"
              }
              onClick={handleSearchSubmit}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default DaoFilter
