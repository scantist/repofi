import { type HomeSearchParams,type Pageable } from "~/lib/schema"
import { DaoStatus, type Prisma } from "@prisma/client"
import { db } from "~/server/db"
import { fetchRepoInfo, parseRepoUrl } from "~/server/tool/repo"
class DaoService{
  async homeSearch(params: HomeSearchParams,pageable:Pageable,userAddress:string|undefined) {
    const whereOptions: Prisma.DaoWhereInput = {}
    if (params.onlyLaunched) {
      whereOptions.status = { equals: DaoStatus.LAUNCHED }
    }
    if (params.starred&&userAddress) {
      whereOptions.stars={ some: { userAddress } }
    }
    if(params.search){
      whereOptions.name={
        contains: params.search,
        mode: "insensitive"
      }
    }
    if(params.owned&&userAddress){
      whereOptions.info={
        holders: {
          some: {
            holderAddress: {
              contains: userAddress,
              mode: "insensitive"
            }
          }
        }
      }
    }
    const total = await db.dao.count({
      where: whereOptions
    })
    const data = await db.dao.findMany({
      take: pageable.size,
      skip: pageable.page * pageable.size,
      select: {
        id: true,
        name: true,
        ticker: true,
        description: true,
        url: true,
        type: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
        createdBy: true,
        walletAddress: true,
        tokenAddress: true,
        links: true,
        status: true,
        marketCapUsd: true,
        priceUsd: true,
        platform: true,
        info: {
          select: {
            tokenAddress: true,
            marketCap: true,
            totalSupply: true,
            holderCount: true,
            assetTokenAddress: true
          }
        },
        stars: userAddress
          ? {
            where: {
              userAddress
            },
            select: {
              userAddress: true
            }
          }
          : false
        },
      where: whereOptions,
      orderBy:params.orderBy === "latest"
        ? { createdAt: "desc" }
        : { marketCapUsd: "desc" }
    })

    const daoList = data.map(async (dao) => {
      const { platform, owner, repo } = parseRepoUrl(dao.url)
      const repoInfo = await fetchRepoInfo(platform, owner, repo)
      return {
        ...dao,
        marketCapUsd: dao.marketCapUsd.toString(),
        priceUsd: dao.priceUsd.toString(),
        isStarred: dao.stars?.length > 0,
        repoStar:repoInfo.stargazers_count,
        repoWatch: repoInfo.watchers_count,
        repoIssues: repoInfo.open_issues_count,
        repoForks: repoInfo.forks_count,
        repoNetwork: repoInfo.network_count,
        repoSubscribers: repoInfo.subscribers_count,
        license: repoInfo.license?.spdx_id,
        info: {
          ...dao.info,
          marketCap: dao.info.marketCap.toString(),
          totalSupply: dao.info.totalSupply.toString(),
          holderCount: dao.info.holderCount.toString()
        }
      }
    })

    return {
      data: daoList,
      nextPage: (pageable.page + 1) * pageable.size < total ? pageable.page + 1 : null
    }
  }
}
export const daoService = new DaoService()
