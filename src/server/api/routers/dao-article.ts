import { z } from "zod"
import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc"
import { daoArticleParamsSchema, pageableSchema } from "~/lib/schema"
import { daoArticleService } from "~/server/service/dao-article"

export const daoArticleRouter = createTRPCRouter({
    create: protectedProcedure
        .input(z.object({
            daoId: z.string(),
            params: daoArticleParamsSchema
        }))
        .mutation(async ({ ctx, input }) => {
            return await daoArticleService.create(
                input.daoId,
                input.params,
                ctx.session!.address
            )
        }),

    update: protectedProcedure
        .input(z.object({
            daoArticleId: z.string(),
            params: daoArticleParamsSchema
        }))
        .mutation(async ({ ctx, input }) => {
            return await daoArticleService.update(
                input.daoArticleId,
                input.params,
                ctx.session!.address
            )
        }),

    delete: protectedProcedure
        .input(z.object({
            daoArticleId: z.string()
        }))
        .mutation(async ({ ctx, input }) => {
            await daoArticleService.delete(
                input.daoArticleId,
                ctx.session!.address
            )
        }),

    page: publicProcedure
        .input(z.object({
            daoId: z.string()
        }).merge(pageableSchema))
        .query(async ({ input }) => {
            return await daoArticleService.page(
                input.daoId,
                { page: input.page, size: input.size }
            )
        }),

    detail: publicProcedure
        .input(z.object({
            daoArticleId: z.string()
        }))
        .query(async ({ input }) => {
            return await daoArticleService.detail(input.daoArticleId)
        })
})
