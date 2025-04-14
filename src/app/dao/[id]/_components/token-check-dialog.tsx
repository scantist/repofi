"use client"

import { useState } from "react"
import type React from "react"
import { type FC } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import type { AssetTokens } from "~/server/service/asset-token"
import { api } from "~/trpc/react"
import { formatUnits } from "viem"

type Props = {
  children: React.ReactNode
  onSelectAsset: (token: AssetTokens[number]) => void
}
const TokenCheckDialog: FC<Props> = ({ children, onSelectAsset }) => {
  const [open, setOpen] = useState(false)
  const { data: assetList = [] } = api.assetToken.getAssetTokens.useQuery()

  const handleSelectAsset = (asset: AssetTokens[number]) => {
    onSelectAsset(asset)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select the DAO asset token</DialogTitle>
          <DialogDescription>This token will be used for asset validation and transactions, the choice is final.</DialogDescription>
        </DialogHeader>
        <div className={"grid grid-cols-1 sm:grid-cols-2 gap-4"}>
          {assetList.map((asset, index) => (
            <button
              onClick={() => handleSelectAsset(asset)}
              type={"button"}
              tabIndex={0}
              key={`asset-${asset.name}-${index}`}
              className={"flex rounded-lg flex-col items-center gap-4 hover:bg-primary/50 p-4 cursor-pointer transition-all"}
            >
              <Avatar className={"w-32 h-32"}>
                <AvatarImage src={asset.logoUrl} alt={asset.name} />
                <AvatarFallback>{asset.name}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-center gap-2">
                <div className={"text-white/50"}>
                  {asset.name}({asset.symbol.toUpperCase()})
                </div>
                <div className="text-sm text-muted-foreground">
                  Launch Fee: {formatUnits(BigInt(asset.launchFee.toString()), asset.decimals)} {asset.symbol.toUpperCase()}
                </div>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TokenCheckDialog
