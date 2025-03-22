import { z } from "zod"
import { DaoContentParamsSchema } from "~/lib/schema"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { daoContentService } from "~/server/service/dao-content"

export const daoContentRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        data: DaoContentParamsSchema,
        daoId: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const { data, daoId } = input
      await daoContentService.create(daoId, data)
    }),
  update: protectedProcedure
    .input(
      z.object({
        data: DaoContentParamsSchema,
        daoContentId: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const { data, daoContentId } = input
      await daoContentService.update(daoContentId, data)
    })
})
