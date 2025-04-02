"use client"

import { Map as MapIcon } from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import type React from "react"
import { toast } from "sonner"
import { useAuth } from "~/components/auth/auth-context"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import { api } from "~/trpc/react"

interface ItemProps {
  emoji: string
  position: string
}

interface HeroCardProps {
  destinations?: ItemProps[]
  treasures?: ItemProps[]
  className?: string
  githubToken?: string
  hasPlatform?: boolean
}

const HeroSectionTextHover: React.FC<HeroCardProps> = ({ className, githubToken, hasPlatform = false }) => {
  const { openDialog, isAuthenticated, address } = useAuth()
  const destinations: ItemProps[] = [
    {
      emoji: "🪂",
      position: "-left-20 top-3 group-hover:-rotate-[10deg] group-hover:-translate-y-12 md:-left-28 md:-top-2 sm:-left-24"
    },
    {
      emoji: "🏖️",
      position: "-left-[72px] top-0 group-hover:-rotate-[20deg] group-hover:-translate-x-10 md:-left-[135px] md:-top-2 sm:-left-24 "
    },
    {
      emoji: "🚁",
      position: "left-[150px] top-0 group-hover:rotate-[10deg] group-hover:-translate-y-10 md:left-[210px] md:-top-1 sm:left-[180px]"
    },
    {
      emoji: "🏯",
      position: "left-[105px] top-0 group-hover:rotate-[20deg] group-hover:translate-x-16 md:left-[190px] md:-top-2 sm:left-[150px]"
    }
  ]

  const treasures: ItemProps[] = [
    {
      emoji: "🦝",
      position: "-left-[100px] -top-7 -rotate-[30deg] group-hover:-translate-y-8 md:-left-40 md:-top-16 sm:-left-32"
    },
    {
      emoji: "🍜",
      position: "-left-[115px] -top-2 group-hover:-rotate-45 md:-left-44 md:-top-1 sm:-left-36"
    },
    {
      emoji: "🏝️",
      position: "left-32 -top-12 rotate-[30deg] md:left-[200px] md:-top-[70px] sm:left-[175px] sm:-top-12"
    },
    {
      emoji: "💎",
      position: "left-32 -top-2 group-hover:rotate-[45deg] md:left-[200px] md:-top-1 sm:left-[160px] "
    }
  ]

  const { mutate, isPending: mutatePending } = api.user.bind.useMutation({
    onSuccess: () => {
      toast.success("Bind success!")
    },
    onError: () => {
      toast.error("Bind failed!")
    }
  })

  const router = useRouter()
  const pathname = usePathname()
  const handleBind = async () => {
    if (mutatePending) {
      return
    }

    if (!isAuthenticated) {
      toast.warning("Please connect your wallet.")
      return
    }
    if (!githubToken) {
      router.push(`/api/oauth/github?rollbackUrl=${pathname}`)
    } else {
      mutate({
        accessToken: githubToken,
        platform: "GITHUB"
      })
    }
  }

  return (
    <div className={cn("storybook-fix py-12å relative min-h-[100px] w-full rounded-2xl border border-gray-200 md:min-h-[200px]", className)}>
      <div className="mb-2 flex flex-col items-center justify-center gap-3">
        <div className="text-normal flex flex-col items-center justify-center p-5 font-bold sm:text-xl md:text-2xl">
          <div className="mt-5">
            <MapIcon size={40} className="fill-zinc-900 text-white" />
          </div>
          {!isAuthenticated && (
            <div className="flex items-center justify-center gap-1 mt-6">
              <span className="text-gray-400">Connect your</span>
              <div className="group relative flex items-center">
                <span className="text-zinc-500 group-hover:text-sky-400"> Web3 Wallet</span>
                <div className="duration-400 absolute inset-0 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100">
                  {destinations.map((dest, index) => (
                    <span
                      key={index}
                      className={cn(
                        "pointer-events-none absolute transform text-lg transition-transform duration-500 group-hover:scale-110 sm:text-2xl md:text-4xl",
                        dest.position
                      )}
                    >
                      {dest.emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          {address && (
            <div className="flex items-center justify-center gap-1 mt-6">
              <span className="text-gray-400">Your wallet </span>
              <div className="group relative flex items-center">
                <span className="text-zinc-500 group-hover:text-sky-400">connect success!</span>
                <div className="duration-400 absolute inset-0 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100">
                  {destinations.map((dest, index) => (
                    <span
                      key={index}
                      className={cn(
                        "pointer-events-none absolute transform text-lg transition-transform duration-500 group-hover:scale-110 sm:text-2xl md:text-4xl",
                        dest.position
                      )}
                    >
                      {dest.emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {!hasPlatform && (
            <div className="flex items-center justify-center gap-1">
              <span className="text-gray-400">and bind your </span>
              <div className="group relative flex items-center">
                <span className="text-zinc-500 group-hover:text-orange-500">Github Account!</span>
                <div className="duration-400 absolute inset-0 cursor-pointer opacity-0 transition-opacity group-hover:opacity-100">
                  {treasures.map((gem, index) => (
                    <span
                      key={index}
                      className={cn("pointer-events-none absolute transform text-lg transition-transform duration-500 group-hover:scale-110 sm:text-2xl md:text-4xl", gem.position)}
                    >
                      {gem.emoji}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        {!isAuthenticated && (
          <Button type={"button"} className="px-4 mb-2 " onClick={() => openDialog()}>
            Connect
          </Button>
        )}
        {isAuthenticated && !hasPlatform && (
          <Button type={"button"} className="px-4 mb-2 " onClick={() => handleBind()}>
            bind
          </Button>
        )}
      </div>
    </div>
  )
}

export default HeroSectionTextHover
