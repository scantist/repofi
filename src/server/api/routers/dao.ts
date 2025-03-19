import { z } from "zod"
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure
} from "~/server/api/trpc"
import {
  createDaoParamsSchema,
  homeSearchParamsSchema,
  pageableSchema
} from "~/lib/schema"
import {
  type DaoDetailResult,
  type DaoSearchResult,
  daoService
} from "~/server/service/dao"

export const daoRouter = createTRPCRouter({
  search: publicProcedure
    .input(homeSearchParamsSchema.merge(pageableSchema))
    .query(async ({ ctx, input }): Promise<DaoSearchResult> => {
      const userAddress = ctx.session?.address
      const { page, size, ...homeSearchParams } = input
      return daoService.search(homeSearchParams, { page, size }, userAddress)
    }),
  create: protectedProcedure
    .input(createDaoParamsSchema)
    .mutation(async ({ ctx, input }) => {
      return await daoService.create(input, ctx.session!.address)
    }),
  checkNameAndTickerExists: protectedProcedure
    .input(z.object({ name: z.string(), ticker: z.string() }))
    .mutation(async ({ input }) => {
      return [
        await daoService.checkNameExists(input.name),
        await daoService.checkTickerExists(input.ticker)
      ]
    }),
  findByUrl: protectedProcedure
    .input(z.object({ url: z.string() }))
    .query(async ({ input }) => {
      return await daoService.findByUrl(input.url)
    }),
  chart: publicProcedure
    .input(
      z.object({
        tokenId: z.bigint(),
        to: z.number(),
        countBack: z.number(),
        resolution: z.enum(["1", "5"]).optional().default("1").catch("1")
      }),
    )
    .query(async ({ input }) => {
      return await daoService.chart(
        input.tokenId,
        input.to,
        input.countBack,
        input.resolution,
      )
    }),
  contents: publicProcedure
    .input(
      z.object({
        daoId: z.string()
      }),
    )
    .query(async ({ input }) => {
      return await daoService.contents(input.daoId)
    }),
  detail: publicProcedure
    .input(
      z.object({
        daoId: z.string()
      }),
    )
    .query(async ({ input }): Promise<DaoDetailResult> => {
      return await daoService.detail(input.daoId)
    })

})
