import { z } from "zod"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { pageableSchema } from "~/lib/schema"
import { contributorService } from "~/server/service/contributor"

export const contributorRouter = createTRPCRouter({
  getTop10Contributor: publicProcedure
    .input(z.object({ daoId: z.string() }))
    .query(async ({ input }) => {
      return await contributorService.getTop10Contributor(input.daoId)
    }),
  getContributors: publicProcedure
    .input(z.object({ daoId: z.string() }).merge(pageableSchema))
    .query(async ({ input }) => {
      return await contributorService.getContributors(input.daoId, {
        page: input.page,
        size: input.size
      })
    })
})
