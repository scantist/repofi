import { DaoStatus } from "@prisma/client"
import { z } from "zod"
import { createDaoParamsSchema, homeSearchParamsSchema, pageableSchema, updateDaoParamsSchema } from "~/lib/schema"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc"
import { type DaoDetailResult, type DaoSearchResult, daoService } from "~/server/service/dao"

export const daoRouter = createTRPCRouter({
  search: publicProcedure.input(homeSearchParamsSchema.merge(pageableSchema)).query(async ({ ctx, input }): Promise<DaoSearchResult> => {
    const userAddress = ctx.session?.address
    const { page, size, ...homeSearchParams } = input
    return daoService.search(homeSearchParams, { page, size }, userAddress)
  }),
  create: protectedProcedure.input(createDaoParamsSchema).mutation(async ({ ctx, input }) => {
    return await daoService.create(input, ctx.session!.address)
  }),
  fundraise: protectedProcedure.input(z.object({ daoId: z.string(), tokenId: z.bigint().min(1n, { message: "Token ID is required." }) })).mutation(async ({ ctx, input }) => {
    return await daoService.fundraise(input.daoId, input.tokenId, ctx.session!.address)
  }),
  update: protectedProcedure.input(updateDaoParamsSchema).mutation(async ({ ctx, input }) => {
    return await daoService.update(input, ctx.session!.address)
  }),
  checkNameAndTickerExists: protectedProcedure.input(z.object({ name: z.string(), ticker: z.string() })).mutation(async ({ input }) => {
    return [await daoService.checkNameExists(input.name), await daoService.checkTickerExists(input.ticker)]
  }),
  findByUrl: protectedProcedure.input(z.object({ url: z.string() })).query(async ({ input }) => {
    return await daoService.findByUrl(input.url)
  }),
  chart: publicProcedure
    .input(
      z.object({
        tokenId: z.bigint(),
        to: z.number(),
        countBack: z.number(),
        resolution: z.enum(["1", "5"]).optional().default("1").catch("1")
      })
    )
    .query(async ({ input }) => {
      return await daoService.chart(input.tokenId, input.to, input.countBack, input.resolution)
    }),
  contents: publicProcedure
    .input(
      z.object({
        daoId: z.string()
      })
    )
    .query(async ({ input }) => {
      return await daoService.contents(input.daoId)
    }),
  detail: publicProcedure
    .input(
      z.object({
        daoId: z.string()
      })
    )
    .query(async ({ input }): Promise<DaoDetailResult> => {
      return await daoService.detail(input.daoId)
    }),
  portfolio: protectedProcedure
    .input(
      z.object({
        page: z.number(),
        size: z.number(),
        status: z.array(z.nativeEnum(DaoStatus)).optional(),
        starred: z.boolean().optional().default(false),
        search: z.string().optional(),
        orderBy: z.enum(['marketCap', 'latest']).optional()
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, size, ...params } = input
      return daoService.portfolio(
        ctx.session!.address,
        { page, size },
        params
      )
    }),
  toggleStar: protectedProcedure
    .input(
      z.object({
        daoId: z.string()
      })
    )
    .mutation(async ({ ctx, input }) => {
      return daoService.toggleStar(input.daoId, ctx.session!.address)
    })
})
