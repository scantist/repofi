"use client"

import NumberFlow from "@number-flow/react"
import Decimal from "decimal.js"
import { Sparkle } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import type React from "react"
import type { FC } from "react"
import { toast } from "sonner"
import { useAccount } from "wagmi"
import { z } from "zod"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Button } from "~/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { useAssetTokenBalance } from "~/hooks/use-asset-token"
import { useBalance } from "~/hooks/use-launch-contract"
import { cn } from "~/lib/utils"
import { defaultChain, toHumanAmount } from "~/lib/web3"
import type { AssetTokens } from "~/server/service/asset-token"
import { api } from "~/trpc/react"

type Props = {
  children: React.ReactNode
  onSubmit: (initialBuyAmount: Decimal, assetToken: AssetTokens[number]) => void
  symbol?: string
}
const TokenCheckDialog: FC<Props> = ({ children, onSubmit, symbol }) => {
  const [open, setOpen] = useState(false)
  const { data: assetTokenList = [] } = api.assetToken.getAssetTokens.useQuery()
  const [selectedToken, setSelectedToken] = useState<string | undefined>()
  const [inputRawValue, setInputRawValue] = useState<string>("0")
  const [inputValue, setInputValue] = useState<Decimal>(new Decimal(0))
  const [isOverMax, setIsOverMax] = useState(false)
  useEffect(() => {
    updateInputValue("0")
    if (assetTokenList && assetTokenList.length > 0 && !selectedToken) {
      // 安全访问第一个元素
      const firstToken = assetTokenList[0]
      if (firstToken?.address) {
        setSelectedToken(firstToken.address)
      }
    }
  }, [assetTokenList, selectedToken])
  const { address } = useAccount()

  const assetToken = useMemo(() => {
    return assetTokenList?.find((token) => token.address === selectedToken)
  }, [assetTokenList, selectedToken])

  const { balance, isBalanceLoading, refetchBalance } = useAssetTokenBalance(assetToken?.address as `0x${string}`)
  const updateInputValue = (rawValue: string) => {
    if (z.coerce.number().safeParse(rawValue).success) {
      if (!assetToken || assetToken.decimals === undefined) return;

      if (rawValue === "") {
        rawValue = "0"
      } else {
        // 处理小数点的情况
        if (rawValue.includes('.')) {
          const parts = rawValue.split('.');
          const intPart = parts[0] || '';
          const decPart = parts[1] || '';
          // 如果整数部分为0或空，保留一个0
          const cleanIntPart = intPart === '' || /^0+$/.test(intPart) ? '0' : intPart.replace(/^0+/, '');
          rawValue = `${cleanIntPart}.${decPart}`;
        } else {
          // 整数情况，移除所有前导零
          rawValue = rawValue.replace(/^0+/, '') || '0'; // 如果全是0，保留一个0
        }
      }

      // 保存输入的原始值用于显示
      setInputRawValue(rawValue)

      try {
        // 转换输入值为 Decimal
        const numValue = new Decimal(rawValue)
          .mul(new Decimal(10).pow(assetToken?.decimals ?? 0))
        setInputValue(numValue)

        // 确保 launchFee 是 Decimal 类型
        const launchFeeDec = new Decimal(assetToken?.launchFee.toString() ?? "0")
        const totalAmount = numValue.plus(launchFeeDec)

        // 确保 balance 值存在且为非零值
        if (balance?.value) {
          const balanceDec = new Decimal(balance.value.toString())
          setIsOverMax(totalAmount.gt(balanceDec))
        } else {
          // 如果余额未加载或为零，则至少让用户可以输入
          setIsOverMax(false)
        }
      } catch (error) {
        console.error("Error calculating values:", error)
        // 出错时默认设为超出
        setIsOverMax(true)
      }
    }
  }
  const handleSubmit = async () => {
    if (!selectedToken) {
      toast.error("You must select a token.")
      return
    }
    if (!assetToken) {
      toast.error("Selected token not found.")
      return
    }
    setOpen(false)
    onSubmit(inputValue, assetToken)
  }

  // TODO
  // const isAssetTokenAgent =
  //   selectedToken === env.NEXT_PUBLIC_AGENT_TOKEN_ADDRESS;
  const isAssetTokenAgent = true

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select the DAO asset token</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6">
          <div className="flex justify-between gap-10">
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">This token will be used for asset validation and transactions, the choice is final.</p>
            </div>
            <Select value={selectedToken} onValueChange={(value) => setSelectedToken(value)}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Select a token" />
              </SelectTrigger>
              <SelectContent>
                {(assetTokenList ?? []).map((token) => (
                  <SelectItem key={token.address} value={token.address}>
                    <div className={"flex flex-row gap-2 items-center"}>
                      <Avatar className={"w-4 h-4"}>
                        <AvatarImage src={token.logoUrl} alt={token.name} />
                        <AvatarFallback>{token.name}</AvatarFallback>
                      </Avatar>
                      <div>${token.symbol}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-lg">
              Initial Buy of ${symbol}
              <span className="ml-2 text-base text-muted-foreground">(Optional)</span>
            </p>
            <p className="text-sm text-muted-foreground">We recommend to buy a small amount to protect your agent token from snipers.</p>
            <div className="flex items-center justify-between pt-3">
              <div className="place-content-center text-sm font-light text-muted-foreground">
                Balance:
                {address ? isBalanceLoading ? "-" : <strong>{toHumanAmount(balance?.value ?? 0n, assetToken?.decimals ?? 0, 2)}</strong> : "n/a"} $
                {assetToken?.symbol}
              </div>
              <Button
                variant="link"
                className="h-4 px-0 text-sm"
                onClick={() => {
                  if (!balance?.value) {
                    return
                  }
                  updateInputValue(toHumanAmount(balance.value - BigInt(assetToken?.launchFee.toString() ?? "0"), assetToken?.decimals ?? 0, 2))
                }}
              >
                Max
              </Button>
            </div>
            <div className="relative">
              <Input
                className={cn(
                  "h-16 bg-transparent pl-4 !text-lg tabular-nums",
                  isOverMax ? "border-red-500 text-red-500" : ""
                )}
                placeholder="0.00"
                value={inputRawValue}
                onChange={(e) => {
                  updateInputValue(e.target.value)
                }}
                pattern="[0-9]*"
              />
              <p className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 font-light",
                isOverMax ? "text-red-500" : ""
              )}>
                ${assetToken?.symbol}
              </p>

              {/* 添加错误提示 */}
              {isOverMax && (
                <p className="mt-1 text-xs text-red-500">
                  Amount exceeds your balance
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b py-6 text-muted-foreground">
            <div className="flex items-center justify-between text-lg">
              <p>DAO Mint Fee</p>
              <NumberFlow value={Number(toHumanAmount(assetToken?.launchFee.toString() ?? '0', assetToken?.decimals ?? 0, 10))} format={{ minimumFractionDigits: 2, maximumFractionDigits: 10 }} suffix={` $${assetToken?.symbol}`} />
            </div>
            <div className="flex items-center justify-between text-lg">
              <p>Initial Buy</p>
              <NumberFlow value={Number(inputRawValue)} format={{ minimumFractionDigits: 2, maximumFractionDigits: 10 }} suffix={` $${assetToken?.symbol}`} />
            </div>
          </div>

          <div className="flex items-center justify-between text-lg">
            <p>Total</p>
            <NumberFlow
              // TODO
              // value={inputValue + env.NEXT_PUBLIC_AGENT_CREATION_FEE}
              value={Number(inputRawValue) + Number(toHumanAmount(assetToken?.launchFee.toString() ?? '0', assetToken?.decimals ?? 0, 10))}
              format={{ minimumFractionDigits: 2, maximumFractionDigits: 10 }}
              suffix={` ${assetToken?.symbol}`}
            />
          </div>
        </div>
        <Button
          className="mt-10 w-full py-8 text-lg font-bold [&_svg]:size-6"
          onClick={handleSubmit}
          disabled={isOverMax || !selectedToken}
        >
          <Sparkle />
          Fundraising Your DAO
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default TokenCheckDialog
