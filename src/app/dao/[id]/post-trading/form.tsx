"use client"

import { Input } from "~/components/ui/input"
import { type DaoDetailResult } from "~/server/service/dao"
import Image from "next/image"
import { useState } from "react"
import { useAssetTokenInfo } from "~/hooks/use-asset-token"
import { z } from "zod"
import { fromHumanAmount, toHumanAmount } from "~/lib/web3"
import { useAuth } from "~/components/auth/auth-context"
import { Button } from "~/components/ui/button"
import { Loader2, Rocket } from "lucide-react"
import NumberFlow from "@number-flow/react"
import { cn } from "~/lib/utils"
import {
  ErrorOverlay,
  LoadingOverlay,
  SuccessOverlay
} from "./trading-components"
import PostTradingFeePopover from "./post-trading-fee-popover"
import PostSlippagePopover from "~/app/dao/[id]/post-trading/post-slippage-popover"
import { useAmountOutMin, useTrade } from "~/hooks/use-uniswap"
import { defaultWToken } from "~/components/auth/config"
interface TradingFormProps {
  data: DaoDetailResult;
  mode: "buy" | "sell";
}

const leftTokenDecimals = 18
const PostTradingForm = ({ data, mode }: TradingFormProps) => {
  const isBuy = mode === "buy"
  const { address, openDialog, isAuthenticated } = useAuth()
  const { data: assetTokenInfo } = useAssetTokenInfo(
    data.tokenInfo.assetTokenAddress,
  )
  const repoToken = {
    ticker: data.ticker,
    address: data.tokenInfo.tokenAddress as `0x${string}`,
    decimals: 18,
    icon: (
      <Image src={data.avatar} alt="Avatar" fill className="object-cover" />
    )
  }

  const assetToken = {
    ticker: assetTokenInfo?.symbol ?? "NONE",
    address: assetTokenInfo?.isNative?defaultWToken:assetTokenInfo?.address as `0x${string}`,
    decimals: assetTokenInfo?.decimals ?? 0,
    icon: (
      <Image
        src={assetTokenInfo?.logoUrl ?? ""}
        alt="Avatar"
        fill
        className="object-cover"
      />
    )
  }

  const tokenOut = isBuy ? repoToken : assetToken
  const tokenIn = isBuy ? assetToken : repoToken

  const [amountInRaw, setAmountInRaw] = useState<string>("0.00")
  const [amountIn, setAmountIn] = useState<bigint>(0n)
  const [slippage, setSlippage] = useState<number>(5)

  const updateAmountInFromRaw = (rawValue: string) => {
    if (z.coerce.number().safeParse(rawValue).success) {
      setAmountInRaw(rawValue)
      setAmountIn(
        BigInt(
          fromHumanAmount(
            rawValue,
            tokenIn?.decimals ?? leftTokenDecimals,
          ).toString(),
        ),
      )
    }
  }

  const updateAmountIn = (value: bigint, decimals?: number) => {
    setAmountIn(value)
    setAmountInRaw(toHumanAmount(value, decimals ?? leftTokenDecimals, 2))
  }

  const {
    amountOutMin,
    amountOut,
    isLoading: isAmountsOutLoading
  } = useAmountOutMin({
    tokenIn: tokenIn.address,
    tokenOut: tokenOut.address,
    amountIn,
    slippagePercent: slippage
  })
  console.log("amountOut", amountOut)

  const {
    balance,
    isBalanceOk,
    isBalanceLoading,
    isApprovePending,
    isApproving,
    isApproveError,
    hasBeenApproved,

    isTradePending,
    isTrading,
    isTradeError,

    error,

    startTrading,
    resetTrading,
    tradeReceipt
  } = useTrade({
    tokenIn: tokenIn.address,
    tokenOut: tokenOut.address,
    amountIn,
    amountOutMin: amountOutMin
  })
  console.log({ isApprovePending, isTradePending })
  const handleSubmit = async () => {
    if (!isAuthenticated) {
      void openDialog()
      return
    }

    startTrading()
  }

  if (error) {
    console.log(error)
  }
  const [showLaunchSuccess, setShowLaunchSuccess] = useState(false)
  const [tradeTxHash, setTradeTxHash] = useState<`0x${string}` | undefined>(
    undefined,
  )

  if (!data.tokenInfo.isGraduated && !showLaunchSuccess) {
    setShowLaunchSuccess(true)
  } else if (!!tradeReceipt) {
    resetTrading()
    setTradeTxHash(tradeReceipt.transactionHash)
  }

  return (
    <div className={"relative w-full"}>
      <LoadingOverlay
        sendingToken={tokenIn}
        receivingToken={tokenOut}
        approving={isApproving}
        trading={isTrading}
        approved={hasBeenApproved}
      />
      <ErrorOverlay
        approvingError={isApproveError}
        tradingError={isTradeError}
        onReset={() => {
          resetTrading()
          updateAmountInFromRaw("0.00")
        }}
      />
      <SuccessOverlay
        sendingToken={tokenIn}
        receivingToken={tokenOut}
        success={!!tradeTxHash}
        transactionHash={tradeTxHash ?? ""}
        onReset={() => {
          updateAmountInFromRaw("0.00")
          setTradeTxHash(undefined)
        }}
      />
      <div className={"text-sn mt-4 flex flex-row justify-between"}>
        <div className={"text-gray-500"}>
          ${tokenIn.ticker.toUpperCase()} Balance{" "}
          {isAuthenticated ? (
            isBalanceLoading ? (
              "-"
            ) : (
              <strong>
                {toHumanAmount(
                  balance?.value ?? 0n,
                  balance?.decimals ?? leftTokenDecimals,
                  2,
                )}
              </strong>
            )
          ) : (
            "n/a"
          )}
        </div>
        <div
          className={"cursor-pointer font-thin tracking-tighter underline"}
          onClick={() => {
            if (balance) {
              updateAmountIn(
                (balance.value * BigInt(100)) / 100n,
                balance.decimals,
              )
            }
          }}
        >
          MAX
        </div>
      </div>
      <div className={"relative mt-2 w-full"}>
        <Input
          placeholder="0.00"
          value={amountInRaw}
          onChange={(e) => updateAmountInFromRaw(e.target.value)}
          pattern="[0-9]*"
          className={cn(
            "h-16 w-full pr-20 !text-xl tabular-nums",
            !isBalanceOk && !!address ? "text-red-500" : "",
          )}
        />
        <div className={"absolute top-0 right-4 flex h-full items-center"}>
          ${tokenIn.ticker.toUpperCase()}
        </div>
      </div>
      <div className={"mt-4 grid grid-cols-3 gap-4"}>
        {(mode === "buy" ? ["100", "200", "500"] : ["10K", "100K", "1M"]).map(
          (item) => (
            <button
              key={item}
              className="text-muted-foreground hover:text-foreground cursor-pointer rounded-sm bg-[#22272B] py-2 text-center text-xs font-thin"
              onClick={() =>
                updateAmountInFromRaw(
                  item.replace("K", "000").replace("M", "000000"),
                )
              }
            >
              {item}
            </button>
          ),
        )}
      </div>
      <div className={"mt-4 text-gray-600"}>
        You will receive about
        <NumberFlow
          value={
            amountOut
              ? parseFloat(
                  toHumanAmount(
                    amountOut,
                    isBuy
                      ? leftTokenDecimals
                      : (assetTokenInfo?.decimals ?? leftTokenDecimals),
                    2,
                  ),
                )
              : 0
          }
          format={{
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
          }}
          className="text-primary mx-1 font-bold"
        />
        <span className={"text-white"}>${tokenOut.ticker.toUpperCase()}</span>
      </div>
      <div className={"mt-8 flex flex-row justify-between text-gray-600"}>
        <PostTradingFeePopover />
        <PostSlippagePopover
          slippage={slippage}
          setSlippage={(value) => setSlippage(value)}
        />
      </div>
      <Button
        size="lg"
        onClick={handleSubmit}
        disabled={
          isTrading ||
          isTradePending ||
          isApprovePending ||
          isApproving ||
          isBalanceLoading ||
          isAmountsOutLoading ||
          (!isBalanceOk && !!address)
        }
        className={
          "bg-secondary relative mt-8 w-full rounded-4xl py-4 text-center"
        }
      >
        {!address
          ? "Connect"
          : isBuy
            ? `Buy $${tokenOut.ticker}`
            : `Sell $${tokenIn.ticker}`}
        {(isApprovePending || isTradePending) && (
          <span className="absolute top-1/2 right-4 flex -translate-y-1/2 items-center gap-2 text-xs">
            <Loader2 className="size-4 animate-spin" />
            Verifying ...
          </span>
        )}
      </Button>
    </div>
  )
}

export default PostTradingForm
