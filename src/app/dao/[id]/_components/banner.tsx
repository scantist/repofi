"use client"

import type { IconType } from "@icons-pack/react-simple-icons"
import { SiDiscord, SiTelegram, SiX } from "@icons-pack/react-simple-icons"
import { useTour } from "@reactour/tour"
import { Footprints, House, Settings, Star } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import TokenCheckDialog from "~/app/dao/[id]/_components/token-check-dialog"
import { useAuth } from "~/components/auth/auth-context"
import BannerWrapper from "~/components/banner-wrapper"
import CardWrapper from "~/components/card-wrapper"
import { MultiStepLoader, type visibleState } from "~/components/ui/multi-step-loader"
import { useApprovedTransaction, useDataPersistence, useLaunchStepState, useLaunchTransaction } from "~/hooks/use-create"
import { LaunchNativeSteps, LaunchNoNativeSteps } from "~/lib/const"
import type { DaoLinks } from "~/lib/schema"
import { cn } from "~/lib/utils"
import type { AssetTokens } from "~/server/service/asset-token"
import type { DaoDetailResult } from "~/server/service/dao"
import { api } from "~/trpc/react"

interface BannerProps {
  daoDetail?: DaoDetailResult
  id: string
  isOwned?: boolean
}

const socialIcons: Record<string, IconType> = {
  website: House,
  x: SiX,
  discord: SiDiscord,
  telegram: SiTelegram
}

const IconComponent = ({ type, href }: { type: string; href: string }) => {
  if (href.trim().length === 0) {
    return null
  }
  const IconComponent = socialIcons[type]
  return IconComponent ? (
    <Link href={href} target="_blank" rel="noopener noreferrer">
      <IconComponent className={"h-6 w-6 text-muted-foreground hover:text-muted-foreground/50"} />
    </Link>
  ) : null
}

const Banner = ({ daoDetail, id, isOwned }: BannerProps) => {
  const { data } = api.dao.detail.useQuery(
    { daoId: id },
    {
      initialData: daoDetail
    }
  )
  const { isAuthenticated } = useAuth()
  const { launchStepState, updateDescription, initStep, nextStep, errorStep, exitStep, finallyStep } = useLaunchStepState()
  const [assetSteps, setAssetSteps] = useState<visibleState[]>([])
  const router = useRouter()
  const handleToDetail = () => {
    router.push(`/dao/${id}`)
  }
  const linksNode = useMemo(() => {
    return ["website", "x", "discord", "telegram"].map((socialType) => (
      <IconComponent key={socialType} type={socialType} href={(data?.links as DaoLinks)?.find((link) => link.type.toLowerCase() === socialType)?.value ?? ""} />
    ))
  }, [data])

  const { setIsOpen } = useTour()
  const useUtils = api.useUtils()
  const { mutate } = api.dao.toggleStar.useMutation({
    onSuccess: () => {
      void useUtils.dao.detail.refetch()
    }
  })
  const handleClickStart = () => {
    setIsOpen(true)
  }
  const [isVerifying, startVerify] = useTransition()
  const onError = (error: Error) => {
    updateDescription(error.message)
    errorStep()
    throw error
  }
  const { execute: approvedTransaction } = useApprovedTransaction({
    onApproveMessage: updateDescription,
    onApproveError: onError
  })
  const { execute: launchTransaction } = useLaunchTransaction({
    onLaunchMessage: updateDescription,
    onLaunchError: onError
  })
  const { execute: dataPersistence } = useDataPersistence({
    onPersistenceMessage: updateDescription,
    onPersistenceError: onError
  })
  const submit = (initialBuyAmount: number, asset: AssetTokens[number]) => {
    // TODO init data
    setAssetSteps(asset.isNative ? LaunchNativeSteps : LaunchNoNativeSteps)
    initStep()
    startVerify(async () => {
      try {
        if (!asset.isNative) {
          await approvedTransaction(asset)
          nextStep()
        }
        const tokenId = await launchTransaction(daoDetail!.name, daoDetail!.ticker, asset)
        nextStep()
        await dataPersistence(daoDetail!.id, tokenId)
        finallyStep()
      } catch (e) {}
    })
  }

  return (
    <BannerWrapper className={"flex w-full flex-col"}>
      <MultiStepLoader
        loadingStates={assetSteps}
        errorState={launchStepState.error}
        visible={launchStepState.showSteps}
        currentState={launchStepState.now}
        description={launchStepState.description}
        progressState={launchStepState.progress}
        onClose={exitStep}
        onFinish={() => {
          exitStep()
          useUtils.dao.detail.invalidate()
          router.refresh()
        }}
      />
      <div className={"my-10 flex w-full flex-col gap-8 md:flex-row"}>
        <CardWrapper className={"max-h-fit max-w-fit"}>
          <Image
            onClick={handleToDetail}
            height={240}
            width={335}
            className={"cursor-pointer aspect-square h-60 w-full rounded-t-lg object-cover"}
            alt={"banner"}
            src={daoDetail?.avatar ?? ""}
          />
        </CardWrapper>
        <div className={"flex flex-1 flex-col"}>
          <div className={"flex flex-row items-center justify-between gap-x-2"}>
            <div className={"flex flex-row items-end gap-x-4 "}>
              <div onClick={handleToDetail} className={"text-5xl font-bold tracking-tighter mr-4 cursor-pointer"}>
                {data?.name}
              </div>
              {linksNode}
            </div>
            <div className={"flex flex-row items-end gap-x-4 action"}>
              <Footprints className={"cursor-pointer text-primary-foreground hover:text-primary transition-all "} onClick={handleClickStart} aria-label={"Dao Tour"} />
              {isOwned && (
                <a href={`/dao/${id}/edit`}>
                  <Settings className={"text-primary-foreground hover:text-primary transition-all"} />
                </a>
              )}
              <Star
                className={cn(
                  "text-white/40 hover:scale-125 cursor-pointer hover:fill-yellow-400 hover:text-yellow-400 z-20 transition",
                  data?.isStarred && "text-yellow-400 fill-yellow-400"
                )}
                onClick={(event) => {
                  if (data) {
                    mutate({ daoId: data.id })
                  }
                  event.stopPropagation()
                }}
              />
            </div>
          </div>
          <Link href={data?.url ?? "#"} className={"mt-2 text-gray-500 w-auto max-w-fit"}>
            {data?.url}
          </Link>

          <div className={"mt-1 flex flex-row gap-4 text-sm"}>
            <div>License: {data?.license}</div>
            <div className={"border-l border-gray-400 pl-4"}>Star: {data?.repoStar}</div>
            <div className={"border-l border-gray-400 pl-4"}>Watch: {data?.repoWatch}</div>
            <div className={"border-l border-gray-400 pl-4"}>Fork: {data?.repoForks}</div>
          </div>
          <div
            className={"mt-4 text-sm line-clamp-5 overflow-auto"}
            style={{
              scrollbarWidth: "none", // Firefox
              msOverflowStyle: "none" // IE 10+
            }}
          >
            {data?.description}
          </div>
          {isAuthenticated && isOwned && data?.status === "PRE_LAUNCH" && (
            <div className={"flex mt-4"}>
              <TokenCheckDialog onSubmit={submit}>
                <div className="relative group cursor-pointer">
                  <div className="relative px-6 py-2 border-2 border-primary text-primary font-bold text-md rounded-lg transform transition-all duration-300 group-hover:translate-y-1 group-hover:translate-x-1 shadow-[6px_6px_10px_rgba(0,0,0,0.6),-6px_-6px_10px_rgba(255,255,255,0.1)] group-hover:shadow-[8px_8px_15px_rgba(0,0,0,0.8),-8px_-8px_15px_rgba(255,255,255,0.15)]">
                    <span>✨</span> FUNDRAISING
                  </div>
                  <div className="absolute inset-0 border-2 border-dashed border-primary rounded-md opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute -top-2 -right-2 w-4 h-4 bg-primary rounded-full animate-ping shadow-lg" />
                  <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-primary rounded-full animate-ping shadow-lg" />
                  <div className="absolute top-1/3 left-3 w-3 h-3 bg-secondary rounded-full animate-ping opacity-70" />
                  <div className="absolute top-2/3 right-3 w-3 h-3 bg-secondary rounded-full animate-ping opacity-70" />
                </div>
              </TokenCheckDialog>
            </div>
          )}
        </div>
      </div>
    </BannerWrapper>
  )
}

export default Banner
