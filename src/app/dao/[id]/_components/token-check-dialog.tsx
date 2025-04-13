"use client"

import type React from "react"
import type { FC } from "react"
import { useDaoContext } from "~/app/dao/[id]/context"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "~/components/ui/dialog"
import type { AssetTokens } from "~/server/service/asset-token"
import { api } from "~/trpc/react"
type Props = {
  children: React.ReactNode
}

const TokenCheckDialog: FC<Props> = ({ children }) => {
  const { data: assetList = [] } = api.assetToken.getAssetTokens.useQuery()
  const { detail } = useDaoContext()

  const handleSelectToken = (token: AssetTokens[number]) => {
    console.log(detail, token)
    // TODO: handle select token
  }

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select the DAO asset token</DialogTitle>
          <DialogDescription>This token will be used for asset validation and transactions, the choice is final.</DialogDescription>
        </DialogHeader>
        <div className={"grid grid-cols-1 sm:grid-cols-2 gap-4"}>
          {assetList.map((asset, index) => (
            <button
              onClick={() => handleSelectToken(asset)}
              type={"button"}
              tabIndex={0}
              key={`asset-${asset.name}-${index}`}
              className={"flex rounded-lg flex-col items-center gap-4 hover:bg-primary/50 p-4 cursor-pointer transition-all"}
            >
              <Avatar className={"w-32 h-32"}>
                <AvatarImage src={asset.logoUrl} alt={asset.name} />
                <AvatarFallback>{asset.name}</AvatarFallback>
              </Avatar>
              <div className={"text-white/50"}>
                {asset.name}({asset.symbol.toUpperCase()})
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TokenCheckDialog
