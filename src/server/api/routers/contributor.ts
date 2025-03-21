import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc"
import { pageableSchema } from "~/lib/schema"
import { type ContributorPage, contributorService } from "~/server/service/contributor"
import { DaoPlatformSchema } from "~/lib/zod"

export const contributorRouter = createTRPCRouter({
  getTop10Contributor: publicProcedure.input(z.object({ daoId: z.string() })).query(async ({ input }) => {
    return await contributorService.getTop10Contributor(input.daoId)
  }),
  getContributors: publicProcedure.input(z.object({ daoId: z.string() }).merge(pageableSchema)).query(async ({ input }): Promise<ContributorPage> => {
    return await contributorService.getContributors(input.daoId, {
      page: input.page,
      size: input.size
    })
  }),
  bind: protectedProcedure.input(z.object({ accessToken: z.string(), platform: DaoPlatformSchema })).mutation(async ({ input, ctx }) => {
    const userAddress = ctx.session!.address
    return await contributorService.bind(input.accessToken, input.platform, userAddress)
  })
})
