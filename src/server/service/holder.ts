import {db} from "~/server/db"
import type {Pageable} from "~/lib/schema"
import type {PageableData} from "~/types/data"
import type {DaoGraduationHolder, DaoLaunchHolder} from "~/lib/zod";

class HolderService {
  async getTop10Holders(tokenId: bigint) {
    let holders: DaoGraduationHolder[] | DaoLaunchHolder[]
    const daoTokenInfo = await db.daoTokenInfo.findUnique({
      where: {
        tokenId
      }
    });
    if (!daoTokenInfo) {
      return []
    }
    const conditions = {
      where: {
        tokenId,
        balance: {
          gt: 0
        }
      },
      orderBy: {
        balance: "desc" as const
      },
      take: 10
    }

    if (daoTokenInfo.isGraduated) {
      holders=await db.daoGraduationHolder.findMany(conditions)
    }else{
      holders=await db.daoLaunchHolder.findMany(conditions)
    }
    return holders.map(holder => ({
      tokenId: holder.tokenId,
      userAddress: holder.userAddress,
      balance: holder.balance.toString(),
    }))
  }

  async getHolders(tokenId: bigint, pageable: Pageable) {
    const daoTokenInfo = await db.daoTokenInfo.findUnique({
      where: {
        tokenId
      }
    });
    if (!daoTokenInfo) {
      return {
        list: [],
        total: 0,
        pages: 0
      } as PageableData<never>
    }
    const totalConditions = {
      where: {
        tokenId,
        balance: {
          gt: 0
        }
      }
    }
    const dataConditions = {
      where: {
        tokenId,
        balance: {
          gt: 0
        }
      },
      skip: pageable.page * pageable.size,
      take: pageable.size,
      orderBy: {
        balance: "desc" as const
      }
    }
    let totalItems: number
    let holders: DaoGraduationHolder[] | DaoLaunchHolder[]|{
      userAddress: string;
      tokenId: bigint;
      balance: string;
    }[]
    if (daoTokenInfo.isGraduated) {
      totalItems = await db.daoGraduationHolder.count(totalConditions)
      holders = await db.daoGraduationHolder.findMany(dataConditions)
    } else {
      totalItems = await db.daoLaunchHolder.count(totalConditions)
      holders = await db.daoLaunchHolder.findMany(dataConditions)
    }
    holders = holders.map(holder => ({
      tokenId: holder.tokenId,
      userAddress: holder.userAddress,
      balance: holder.balance.toString(),
    }))
    return {
      list: holders,
      total: totalItems,
      pages: Math.ceil(totalItems / pageable.size)
    } as PageableData<(typeof holders)[number]>
  }

}

export const holderService = new HolderService()
export type Top10Holders = Awaited<ReturnType<typeof holderService.getTop10Holders>>
