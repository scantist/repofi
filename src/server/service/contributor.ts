import type { Pageable } from "~/lib/schema"
import { db } from "~/server/db"
import type { PageableData } from "~/types/data"
import { type DaoPlatform } from "@prisma/client"
import { fetchUserInfo } from "~/server/tool/repo"

class ContributorService {
  async getContributors(daoId: string, pageable: Pageable) {
    const total = await db.contributor.count({
      where: { daoId }
    })
    const contributorList = await db.contributor.findMany({
      where: {
        daoId
      },
      take: pageable.size,
      skip: pageable.page * pageable.size,
      orderBy: {
        snapshotValue: "desc"
      }
    })
    const formattedContributorList=contributorList.map(contributor=>{
      return {
        ...contributor,
        snapshotValue:contributor.snapshotValue.toString()
      }
    })
    return {
      list: formattedContributorList,
      pages: Math.ceil(total / pageable.size),
      total: total
    } as PageableData<(typeof formattedContributorList)[number]>
  }

  async getTop10Contributor(daoId: string) {
    return await db.contributor.findMany({
      where: {
        daoId
      },
      take: 10,
      orderBy: {
        snapshotValue: "desc"
      }
    })
  }
  async bind(accessToken: string, platform: DaoPlatform, userAddress: string) {
    const user = await fetchUserInfo(accessToken, platform)
    await db.contributor.updateMany({
      where: {
        userPlatformId: user.id,
        dao: {
          platform: platform
        }
      },
      data: {
        userAddress: userAddress,
        userPlatformAvatar: user.avatar,
        userPlatformName: user.name
      }
    })
  }

  async owner(daoId:string, userAddress: string) {
    return await db.contributor.findFirst({
      where:{
        daoId,
        userAddress
      }
    })
  }
}
export const contributorService = new ContributorService()
export type ContributorPage = Awaited<ReturnType<typeof contributorService.getContributors>>
