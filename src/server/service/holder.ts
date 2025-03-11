import { db } from "~/server/db"
import { type Pageable } from "~/lib/schema"

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
  async getHolders(tokenId:bigint,pageable:Pageable) {
    const totalItems = await db.daoTokenHolder.count({
      where: {
        tokenId,
        balance: {
          gt: 0
        }
      }
    })

    const totalPages = Math.ceil(totalItems / pageable.size)

    const actualPage = Math.max(0, Math.min(pageable.page, totalPages - 1))

    const holders = await db.daoTokenHolder.findMany({
      where: {
        tokenId,
        balance: {
          gt: 0
        }
      },
      skip: actualPage * pageable.size,
      take: pageable.size,
      orderBy: {
        balance: "desc"
      }
    })

    return {
      items: holders,
      totalPages,
      currentPage: actualPage,
      totalItems
    }
  }
}

export const holderService = new HolderService()
