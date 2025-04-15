import { z } from "zod"
import { daoContentParamsSchema } from "~/lib/schema"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { daoContentService } from "~/server/service/dao-content"

export const daoContentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        data: daoContentParamsSchema,
        daoId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, daoId } = input
      return await daoContentService.create(daoId, data, ctx.session!.address)
    }),
  update: protectedProcedure
    .input(
      z.object({
        data: daoContentParamsSchema,
        daoContentId: z.string()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { data, daoContentId } = input
      await daoContentService.update(daoContentId, data, ctx.session!.address)
    })
})
