"use client"

import NumberFlow from "@number-flow/react"
import { Sparkle } from "lucide-react"
import { useMemo, useState } from "react"
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
import { useBalance } from "~/hooks/use-launch-contract"
import { cn } from "~/lib/utils"
import { defaultChain, toHumanAmount } from "~/lib/web3"
import type { AssetTokens } from "~/server/service/asset-token"
import { api } from "~/trpc/react"

type Props = {
  children: React.ReactNode
  onSubmit: (initialBuyAmount: number, assetToken: AssetTokens[number]) => void
}
const TokenCheckDialog: FC<Props> = ({ children, onSubmit }) => {
  const [open, setOpen] = useState(false)
  const { data: assetTokenList = [] } = api.assetToken.getAssetTokens.useQuery()
  const [selectedToken, setSelectedToken] = useState<string | undefined>()
  const [inputRawValue, setInputRawValue] = useState<string>("0.00")
  const [inputValue, setInputValue] = useState<number>(0)

  const { address } = useAccount()

  const rightToken = useMemo(() => {
    return assetTokenList?.find((token) => token.address === selectedToken)
  }, [assetTokenList, selectedToken])

  const { data: balance, isLoading: isBalanceLoading } = useBalance({
    // TODO: token ID
    tokenId: 0n,
    address
  })
  // TODO: left token
  const leftTokenDecimals = 0

  const updateInputValue = (rawValue: string) => {
    if (z.coerce.number().safeParse(rawValue).success) {
      setInputRawValue(rawValue)
      setInputValue(Number(rawValue))
    }
  }

  const handleSubmit = async () => {
    if (!selectedToken) {
      toast.error("You must select a token.")
      return
    }
    const assetToken = assetTokenList.find((value) => value.address === selectedToken)
    if (!assetToken) {
      toast.error("Selected token not found.")
      return
    }
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
              {/*TODO change ticker*/}
              Initial Buy of $TICKER
              <span className="ml-2 text-base text-muted-foreground">(Optional)</span>
            </p>
            <p className="text-sm text-muted-foreground">We recommend to buy a small amount to protect your agent token from snipers.</p>
            <div className="flex items-center justify-between pt-3">
              <div className="place-content-center text-sm font-light text-muted-foreground">
                Balance
                {address ? isBalanceLoading ? "-" : <strong>{toHumanAmount(balance?.value ?? 0n, rightToken?.decimals ?? leftTokenDecimals, 2)}</strong> : "n/a"} $
                {rightToken?.symbol}
              </div>
              <Button
                variant="link"
                className="h-4 px-0 text-sm"
                onClick={() => {
                  if (!balance?.value) {
                    return
                  }
                  updateInputValue(toHumanAmount(balance?.value ?? 0n, rightToken?.decimals ?? leftTokenDecimals, 2))
                }}
              >
                Max
              </Button>
            </div>
            <div className="relative">
              <Input
                className={cn(
                  "h-16 bg-transparent pl-4 !text-lg tabular-nums"
                  // notEnoughBalance ? "border border-red-500 text-red-500" : "",
                )}
                placeholder="0.00"
                value={inputRawValue}
                onChange={(e) => {
                  // updateInputValue(e.target.value)
                  setInputRawValue(e.target.value)
                }}
                pattern="[0-9]*"
              />
              <p className="absolute right-4 top-1/2 -translate-y-1/2 font-light">${rightToken?.symbol}</p>
            </div>
          </div>

          <div className="flex flex-col gap-2 border-b py-6 text-muted-foreground">
            <div className="flex items-center justify-between text-lg">
              <p>Agent Creation Fee</p>
              {/*TODO*/}
              {/*<NumberFlow value={env.NEXT_PUBLIC_AGENT_CREATION_FEE} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} suffix=" AGENT" />*/}
              <NumberFlow value={0} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} suffix=" AGENT" />
            </div>
            <div className="flex items-center justify-between text-lg">
              <p>Initial Buy</p>
              <NumberFlow value={inputValue} format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }} suffix={` ${rightToken?.symbol}`} />
            </div>
          </div>

          <div className="flex items-center justify-between text-lg">
            <p>Total</p>
            {isAssetTokenAgent ? (
              <NumberFlow
                // TODO
                // value={inputValue + env.NEXT_PUBLIC_AGENT_CREATION_FEE}
                value={inputValue + 0}
                format={{ minimumFractionDigits: 2, maximumFractionDigits: 2 }}
                suffix={` ${rightToken?.symbol}`}
              />
            ) : (
              <div className="flex items-center gap-2">
                <NumberFlow
                  value={inputValue}
                  format={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }}
                  suffix={` ${rightToken?.symbol}`}
                  className="font-bold"
                />
                <span className="text-muted-foreground">+</span>
                <NumberFlow
                  // TODO
                  // value={env.NEXT_PUBLIC_AGENT_CREATION_FEE}
                  value={0}
                  format={{
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }}
                  // TODO
                  suffix=" AGENT"
                  className="font-bold"
                />
              </div>
            )}
          </div>
        </div>
        <Button className="mt-10 w-full py-8 text-lg font-bold [&_svg]:size-6" onClick={handleSubmit}>
          <Sparkle />
          Fundraising Your DAO
        </Button>
      </DialogContent>
    </Dialog>
  )
}

export default TokenCheckDialog
