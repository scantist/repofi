import { createTRPCRouter, protectedProcedure, publicProcedure } from "~/server/api/trpc"
import { z } from "zod"
import { daoMessageService } from "~/server/service/dao-message"
import { pageableSchema } from "~/lib/schema"

export const messageRouter = createTRPCRouter({
  getMessages: publicProcedure
    .input(
      z.object({
        daoId: z.string(),
        replyLimit: z.number().optional().default(10).describe("Reply limit"),
        pageable: pageableSchema
      })
    )
    .query(async ({ input }) => {
      const { daoId, replyLimit, pageable } = input
      return await daoMessageService.getMessageList(daoId, pageable, replyLimit)
    }),
  createMessage: protectedProcedure.input(z.object({ daoId: z.string(), message: z.string(), replyTo: z.string().optional() })).mutation(async ({ input, ctx }) => {
    const userAddress = ctx.session!.address
    return await daoMessageService.createMessage({
      ...input,
      replyToMessageId: input.replyTo,
      userAddress
    })
  }),
  deleteMessage: protectedProcedure.input(z.object({ messageId: z.string() })).mutation(async ({ input, ctx }) => {
    const userAddress = ctx.session!.address
    return await daoMessageService.deleteMessage(input.messageId, userAddress)
  })
})
