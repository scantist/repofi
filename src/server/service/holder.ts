import { db } from "~/server/db"
import { type Pageable } from "~/lib/schema"
import { type PageableData } from "~/types/data"

class HolderService {
  async getTop10Holders(tokenId: bigint) {
    return await db.daoTokenHolder.findMany({
      where: {
        tokenId,
        balance: {
          gt: 0
        }
      },
      orderBy: {
        balance: "desc"
      },
      take: 10
    })
  }
  async getHolders(tokenId: bigint, pageable: Pageable) {
    const totalItems = await db.daoTokenHolder.count({
      where: {
        tokenId,
        balance: {
          gt: 0
        }
      }
    })

    const totalPages = Math.ceil(totalItems / pageable.size)

    const holders = await db.daoTokenHolder.findMany({
      where: {
        tokenId,
        balance: {
          gt: 0
        }
      },
      skip: pageable.page * pageable.size,
      take: pageable.size,
      orderBy: {
        balance: "desc"
      }
    })

    return {
      list: holders,
      total:totalItems,
      pages:totalPages
    } as PageableData<(typeof holders)[number]>
  }
}

export const holderService = new HolderService()
export type Top10Holders = Awaited<ReturnType<typeof holderService.getTop10Holders>>
