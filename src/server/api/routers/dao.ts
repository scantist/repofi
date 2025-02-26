import { z } from "zod"
import { type Prisma } from "@prisma/client"
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc"
import { DaoStatus } from "@prisma/client"
import { homeSearchParamsSchema, pageableSchema, type HomeSearchParams, type Pageable } from "~/lib/schema"
import { daoService } from "~/server/service/dao"

export const daoRouter = createTRPCRouter({
  homeSearch: publicProcedure
    .input(
      homeSearchParamsSchema.merge(pageableSchema),
    )
    .query(async ({ ctx, input }) => {
      const userAddress = ctx.session?.address
      const { page, size, ...homeSearchParams } = input
      return daoService.homeSearch(homeSearchParams, { page,size }, userAddress)
    }),
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`
      }
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async () => {
      return null
    })
})
