import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc"
import { createDaoParamsSchema, daoInformationParamsSchema, homeSearchParamsSchema, pageableSchema } from "~/lib/schema"
import { daoService } from "~/server/service/dao"

export const daoRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      homeSearchParamsSchema.merge(pageableSchema),
    )
    .query(async ({ ctx, input }) => {
      const userAddress = ctx.session?.address
      console.log("session",ctx.session)
      const { page, size, ...homeSearchParams } = input
      return daoService.search(homeSearchParams, { page,size }, userAddress)
    }),
  create: protectedProcedure
    .input(createDaoParamsSchema)
    .mutation(async ({ ctx,input }) => {
      return await daoService.create(input,ctx.session.address)
    }),
  checkNameAndTickerExists:protectedProcedure
    .input(z.object({ name:z.string(),ticker:z.string() }))
    .mutation(async ({ input })=>{
      return [await daoService.checkNameExists(input.name), await daoService.checkTickerExists(input.ticker)]
    })
})
