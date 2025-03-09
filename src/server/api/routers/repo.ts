import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { z } from "zod"
import { DaoPlatformSchema } from "~/lib/zod"
import { repoService } from "~/server/service/repo"
import { pageableSchema } from "~/lib/schema"
export const repoRouter = createTRPCRouter({
  fetchPublicRepos: publicProcedure
    .input(z.object({ accessToken: z.string(),platform:DaoPlatformSchema,pageable:pageableSchema }))
    .query(({ input }) => {
      return repoService.fetchPublicRepos(input.accessToken,input.platform,input.pageable)
    }),
  fetchPlatformInfo:publicProcedure
    .input(z.object({ accessToken: z.string(),platform:DaoPlatformSchema }))
    .query(({ input }) => {
      return repoService.fetchPlatformInfo(input.accessToken,input.platform)
    }),
  fetchRepoContributors:publicProcedure.input(z.object({ url:z.string() }))
    .query(({ input })=>{
      return repoService.fetchRepoContributors(input.url)
    })
})
