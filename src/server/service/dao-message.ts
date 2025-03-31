import type { ForumMessage } from "@prisma/client"
import { subDays, subHours } from "date-fns"
import { z } from "zod"
import { CommonError, ErrorCode } from "~/lib/error"
import type { Pageable } from "~/lib/schema"
import { ForumMessageSchema } from "~/lib/zod"
import type { PageableData } from "~/types/data"
import { db } from "../db"
import { getRedis } from "../redis"

export const messageWithRepliesSchema = ForumMessageSchema.extend({
  replies: ForumMessageSchema.array(),
  replyCount: z.number()
})

export type MessageWithReplies = z.infer<typeof messageWithRepliesSchema>

class DaoMessageService {
  async getMessageList(daoId: string, pageable: Pageable, replyLimit: number): Promise<PageableData<MessageWithReplies>> {
    const totalCount = await db.forumMessage.count({
      where: {
        daoId,
        deletedAt: null,
        rootMessageId: null
      }
    })

    const totalPages = Math.ceil(totalCount / pageable.size)
    const actualPage = Math.max(0, Math.min(pageable.page, totalPages - 1))

    const messages = await db.forumMessage.findMany({
      where: {
        daoId,
        deletedAt: null,
        rootMessageId: null
      },
      orderBy: {
        createdAt: "desc"
      },
      skip: actualPage * pageable.size,
      take: pageable.size
    })

    if (totalCount === 0) {
      return {
        list: [],
        total: totalCount,
        pages: totalPages
      }
    }

    const messageIds = messages.map((message) => message.id)

    // Get reply counts and ids from redis
    const redis = getRedis()
    const replyInfos = await Promise.all(
      messageIds.map(async (id) => {
        const [count, replyIds] = await Promise.all([redis.zcard(`message-replies:${id}`), redis.zrange(`message-replies:${id}`, 0, replyLimit - 1)])
        return { rootId: id, count, replyIds, replies: [] as ForumMessage[] }
      })
    )

    // Get replies from db
    const replyIds = replyInfos.flatMap((reply) => reply.replyIds)
    // biome-ignore lint/complexity/noForEach: <explanation>
    ;(
      await db.forumMessage.findMany({
        where: {
          id: { in: replyIds },
          deletedAt: null
        }
      })
    ).forEach((reply) => {
      const replyInfo = replyInfos.find((replyInfo) => replyInfo.rootId === reply.rootMessageId)
      if (replyInfo) {
        replyInfo.replies.push(reply)
      }
    })

    const messageWithReplies = messages.map((message) => {
      const replyInfo = replyInfos.find((replyInfo) => replyInfo.rootId === message.id)
      const replies = replyInfo ? replyInfo.replies.sort((a, b) => replyInfo.replyIds.indexOf(a.id) - replyInfo.replyIds.indexOf(b.id)) : []
      const replyCount = replyInfo?.count ?? 0

      return {
        ...message,
        replies,
        replyCount
      }
    })

    return {
      list: messageWithReplies,
      total: totalCount,
      pages: totalPages
    }
  }

  /**
   * Get a list of replies for a message
   * @param messageId - The ID of the message
   * @param cursor - The cursor to start from
   * @param limit - The number of replies to return, defaults to 10
   * @returns A paged response of replies
   */
  async getMessageReplies({
    messageId,
    cursor,
    limit = 10
  }: {
    messageId: string
    cursor: number
    limit?: number
  }) {
    const redis = getRedis()

    const totalCount = await redis.zcard(`message-replies:${messageId}`)

    const replyIds = await redis.zrange(`message-replies:${messageId}`, cursor, cursor + limit - 1)

    const nextCursor = cursor + limit
    const previousCursor = cursor - limit

    const replies = (
      await db.forumMessage.findMany({
        where: {
          id: { in: replyIds },
          deletedAt: null
        }
      })
    ).sort((a, b) => replyIds.indexOf(a.id) - replyIds.indexOf(b.id))

    return {
      items: replies,
      totalItems: totalCount,
      cursor: {
        next: nextCursor >= totalCount ? undefined : nextCursor,
        previous: previousCursor >= 0 ? previousCursor : undefined
      }
    }
  }

  async getMessageById(id: string, expand = false) {
    const message = await db.forumMessage.findUnique({
      where: {
        id,
        deletedAt: null
      }
    })

    if (!message) {
      throw new CommonError(ErrorCode.NOT_FOUND, `Can't found message with id ${id}`)
    }

    if (expand) {
      const messageThread: (ForumMessage & { replyTo?: ForumMessage })[] = [message]
      const MAX_DEPTH = 50 // Prevent infinite loops
      let depth = 0

      while (depth < MAX_DEPTH) {
        const lastMessage = messageThread[messageThread.length - 1]
        if (!lastMessage?.replyToMessage) break

        const replyTo = await db.forumMessage.findUnique({
          where: {
            id: lastMessage.replyToMessage,
            deletedAt: null
          }
        })

        if (replyTo) {
          // Check for circular references
          if (messageThread.some((m) => m.id === replyTo.id)) {
            console.error(`Circular reference detected in message thread: ${message.id}`)
            break
          }
          messageThread.push(replyTo)
        }
        depth++
      }

      if (depth >= MAX_DEPTH) {
        console.warn(`Message thread exceeded maximum depth of ${MAX_DEPTH}: ${message.id}`)
      }

      const result = messageThread.reverse().reduce<ForumMessage | undefined>((acc, message) => {
        message.replyTo = acc
        return message
      }, undefined)

      return result
    }

    return message
  }

  async getRecentUserMessages({
    daoId,
    userAddress,
    startTime,
    limit = 50
  }: {
    daoId: string
    userAddress: string
    startTime?: Date
    limit?: number
  }) {
    startTime = startTime ?? subHours(new Date(), 6)

    const messages = await db.forumMessage.findMany({
      where: {
        daoId,
        createdBy: { not: userAddress },
        createdAt: {
          gte: startTime
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take: Math.max(limit, 100)
    })

    return messages
  }

  async createMessage({
    daoId,
    message,
    userAddress,
    replyToMessageId
  }: {
    daoId: string
    message: string
    userAddress: string
    replyToMessageId?: string
  }) {
    const dao = await db.dao.findUnique({
      where: { id: daoId }
    })

    if (!dao) {
      throw new CommonError(ErrorCode.BAD_PARAMS, `Can't found ${daoId} dao`)
    }

    console.log(`Creating message for dao ${daoId} from user ${userAddress} in reply to message ${replyToMessageId}: ${message.slice(0, 10)}...`)

    const replyTo = replyToMessageId ? await this.getMessageById(replyToMessageId) : null

    if (replyToMessageId && !replyTo) {
      throw new CommonError(ErrorCode.NOT_FOUND, "Reply to message not found")
    }

    if (message.length === 0 || message.length > 256) {
      throw new CommonError(ErrorCode.BAD_PARAMS, "Message cannot be empty or longer than 256 characters")
    }

    const rootMessageId = replyTo?.rootMessageId ?? replyTo?.id ?? null

    if (replyTo && !rootMessageId) {
      console.error(`Cannot determine root message id while replying to message ${replyTo.id}`)
      throw new CommonError(ErrorCode.INTERNAL_ERROR, "Cannot determine root message id while replying to message")
    }

    return await db.$transaction(async (tx) => {
      const newMessage = await tx.forumMessage.create({
        data: {
          daoId,
          message,
          createdBy: userAddress,
          rootMessageId,
          replyToMessage: replyTo?.id ?? null,
          replyToUser: replyTo?.createdBy ?? null
        }
      })

      console.log(`Created message for dao ${daoId}, new message id: ${newMessage.id}`)

      const redis = getRedis()

      if (replyTo) {
        await redis.zadd(`message-replies:${rootMessageId}`, newMessage.createdAt.getTime(), newMessage.id)
      }

      return newMessage
    })
  }

  async deleteMessage(id: string, userAddress: string) {
    await db.$transaction(async (tx) => {
      const message = await tx.forumMessage.findUnique({
        where: { id, createdBy: userAddress },
        select: { rootMessageId: true }
      })

      if (!message) {
        throw new CommonError(ErrorCode.NOT_FOUND, "Message not found")
      }

      await tx.forumMessage.update({
        where: { id, createdBy: userAddress },
        data: { deletedAt: new Date() }
      })

      const redis = getRedis()

      if (message.rootMessageId) {
        // Message is a reply, remove it from the reply list
        await redis.zrem(`message-replies:${message.rootMessageId}`, id)
      } else {
        // Message is a root message, delete the entire reply list
        await redis.del(`message-replies:${id}`)
      }
    })
  }

  /**
   * Reset the reply cache for a DAO
   * @param daoId - The ID of the DAO
   */
  async resetReplyCache(daoId: string) {
    const rootMessages = await db.forumMessage.findMany({
      where: {
        daoId,
        replyToMessage: null,
        deletedAt: null
      }
    })

    for (const message of rootMessages) {
      const replies = await db.forumMessage.findMany({
        where: {
          rootMessageId: message.id,
          deletedAt: null
        }
      })

      const redis = getRedis()
      await redis.del(`message-replies:${message.id}`)
      await redis.zadd(`message-replies:${message.id}`, ...replies.flatMap((reply) => [reply.createdAt.getTime(), reply.id]))
    }
  }

  /**
   * Get message history for a wallet address
   * @param userAddress - The wallet address
   * @param limit - The number of messages to return, defaults to 10
   * @returns An array of messages
   */
  async getMessageHistory(userAddress: string | null, limit = 10) {
    return userAddress
      ? await db.forumMessage.findMany({
          where: {
            createdBy: {
              contains: userAddress,
              mode: "insensitive"
            }
          },
          orderBy: {
            createdAt: "desc"
          },
          take: limit
        })
      : []
  }

  /**
   * Get message statistics for a DAO
   * @param dao - The DAO object with id and walletAddress
   * @returns Message statistics
   */
  async getMessageStats(dao: { id: string; walletAddress: string | null }) {
    const total = await db.forumMessage.count({
      where: { daoId: dao.id }
    })

    if (!dao.walletAddress) {
      return { total, selfTotal: 0, self24h: 0, self7d: 0 }
    }

    const selfTotal = await db.forumMessage.count({
      where: {
        createdBy: {
          contains: dao.walletAddress,
          mode: "insensitive"
        }
      }
    })

    const self24h = await db.forumMessage.count({
      where: {
        createdBy: {
          contains: dao.walletAddress,
          mode: "insensitive"
        },
        createdAt: {
          gte: subHours(new Date(), 24)
        }
      }
    })

    const self7d = await db.forumMessage.count({
      where: {
        createdBy: {
          contains: dao.walletAddress,
          mode: "insensitive"
        },
        createdAt: {
          gte: subDays(new Date(), 7)
        }
      }
    })

    return { total, selfTotal, self24h, self7d }
  }
}

export const daoMessageService = new DaoMessageService()
