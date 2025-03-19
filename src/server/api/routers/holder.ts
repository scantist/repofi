import { z } from "zod"

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { holderService } from "~/server/service/holder"
import { pageableSchema } from "~/lib/schema"

export const holderRouter = createTRPCRouter({
  getTop10Holders: publicProcedure
    .input(z.object({ tokenId: z.bigint() }))
    .query(({ input }) => {
      return holderService.getTop10Holders(input.tokenId)
    }),
  getHolders: publicProcedure
    .input(z.object({ tokenId: z.bigint() }).merge(pageableSchema))
    .query(async ({ input }) => {
      return await holderService.getHolders(input.tokenId, {
        page: input.page,
        size: input.size
      })
    })
})
