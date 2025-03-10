import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { assetTokenService } from "~/server/service/asset-token"

export const assetTokenRouter = createTRPCRouter({
  getAssetTokens: publicProcedure.query(() => {
    return assetTokenService.getAssetTokens()
  })
})
