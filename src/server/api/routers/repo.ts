import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { z } from "zod"
import { DaoPlatformSchema } from "~/lib/zod"
import { repoService } from "~/server/service/repo"
import { pageableSchema } from "~/lib/schema"

export const repoRouter = createTRPCRouter({
  fetchPublicRepos: publicProcedure
    .input(
      z.object({
        accessToken: z.string().optional(),
        platform: DaoPlatformSchema,
        pageable: pageableSchema
      }),
    )
    .query(({ input }) => {
      if (!input.accessToken) {
        return null
      }
      return repoService.fetchPublicRepos(
        input.accessToken,
        input.platform,
        input.pageable,
      )
    }),
  fetchPlatformInfo: publicProcedure
    .input(z.object({ accessToken: z.string().optional(), platform: DaoPlatformSchema }))
    .query(({ input }) => {
      if (!input.accessToken) {
        return null
      }
      return repoService.fetchPlatformInfo(input.accessToken, input.platform)
    }),
  fetchRepoContributors: publicProcedure
    .input(z.object({ url: z.string().optional() }))
    .query(({ input }) => {
      const { url } = input
      if (url) {
        return repoService.fetchRepoContributors(url)
      }
      return null
    })
})
