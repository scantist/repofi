import {
  type CreateDaoParams,
  type DaoLinks,
  type HomeSearchParams,
  type Pageable
} from "~/lib/schema"
import { DaoStatus, type Prisma } from "@prisma/client"
import { db } from "~/server/db"
import {
  fetchRepoContributors,
  fetchRepoInfo,
  parseRepoUrl
} from "~/server/tool/repo"
import { type PageableData } from "~/types/data"
import { emitContributorInit } from "~/server/queue/contributor"

class DaoService {
  async search(
    params: HomeSearchParams,
    pageable: Pageable,
    userAddress: string | undefined,
  ) {
    const whereOptions: Prisma.DaoWhereInput = {}
    if (params.status) {
      whereOptions.status = { in: params.status }
    }
    if (params.starred && userAddress) {
      whereOptions.stars = { some: { userAddress } }
    }
    if (params.search) {
      whereOptions.name = {
        contains: params.search,
        mode: "insensitive"
      }
    }
    if (params.owned && userAddress) {
      whereOptions.tokenInfo = {
        holders: {
          some: {
            userAddress: {
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
        tokenId: true,
        links: true,
        status: true,
        marketCapUsd: true,
        priceUsd: true,
        platform: true,
        tokenInfo: {
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
      orderBy:
        params.orderBy === "latest"
          ? { createdAt: "desc" }
          : { marketCapUsd: "desc" }
    })
    const daoList = []
    for (const dao of data) {
      const { platform, owner, repo } = parseRepoUrl(dao.url)
      const repoInfo = await fetchRepoInfo(platform, owner, repo)
      daoList.push({
        ...dao,
        marketCapUsd: dao.marketCapUsd.toString(),
        priceUsd: dao.priceUsd.toString(),
        isStarred: dao.stars?.length > 0,
        repoStar: repoInfo.stargazers_count,
        repoWatch: repoInfo.watchers_count,
        repoIssues: repoInfo.open_issues_count,
        repoForks: repoInfo.forks_count,
        license: repoInfo.license?.spdx_id,
        tokenInfo: {
          ...dao.tokenInfo,
          marketCap: dao.tokenInfo.marketCap?.toString() ?? "",
          totalSupply: dao.tokenInfo.totalSupply?.toString() ?? "",
          holderCount: dao.tokenInfo.holderCount.toString()
        }
      })
    }

    return {
      list: daoList,
      pages: Math.ceil(total / pageable.size),
      total: total
    } as PageableData<(typeof daoList)[number]>
  }

  async checkNameExists(name: string) {
    return (
      (await db.dao.count({
        where: {
          name
        }
      })) > 0
    )
  }
  async checkTickerExists(ticker: string) {
    return (
      (await db.dao.count({
        where: {
          ticker
        }
      })) > 0
    )
  }

  async create(params: CreateDaoParams, userAddress: string) {
    const links: DaoLinks = []
    if (params.x) {
      links.push({ type: "x", value: params.x })
    }
    if (params.telegram) {
      links.push({ type: "telegram", value: params.telegram })
    }
    if (params.website) {
      links.push({ type: "website", value: params.website })
    }
    const repoMeta = parseRepoUrl(params.url)
    const tokenInfo = await db.daoTokenInfo.upsert({
      where: {
        tokenId: params.tokenId
      },
      update: {},
      create: {
        tokenId: params.tokenId,
        name: params.name,
        ticker: params.ticker,
        creator: userAddress
      }
    })
    const dao = await db.dao.create({
      data: {
        name: params.name,
        ticker: params.ticker,
        description: params.description,
        url: params.url,
        type: params.type,
        avatar: params.avatar,
        createdBy: userAddress,
        tokenId: tokenInfo.tokenId,
        links,
        status: DaoStatus.LAUNCHING,
        platform: repoMeta.platform
      }
    })
    await emitContributorInit(dao.id, dao.url)
    return dao
    //TODO 刷新缓存
  }
  async repoInfo(url: string) {
    const repoMeta = parseRepoUrl(url)
    return await fetchRepoInfo(
      repoMeta.platform,
      repoMeta.owner,
      repoMeta.repo,
    )
  }
  async repoContributors(url: string) {
    const repoMeta = parseRepoUrl(url)
    return await fetchRepoContributors(
      repoMeta.platform,
      repoMeta.owner,
      repoMeta.repo,
    )
  }
  async star(daoId: string, userAddress: string) {
    const daoStar = await db.daoStar.findFirst({
      where: {
        daoId,
        userAddress
      }
    })
    if (daoStar) {
      await db.daoStar.delete({
        where: {
          daoId_userAddress: {
            daoId,
            userAddress
          }
        }
      })
      return false
    } else {
      await db.daoStar.create({
        data: {
          daoId,
          userAddress
        }
      })
      return true
    }
  }
}
export const daoService = new DaoService()
