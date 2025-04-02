import type {CreateDaoParams, DaoLinks, HomeSearchParams, Pageable, UpdateDaoParamsSchema} from "~/lib/schema"
import {DaoStatus, type Prisma} from "@prisma/client"
import {db} from "~/server/db"
import {fetchAllRepoContributors, fetchRepoInfo, parseRepoUrl} from "~/server/tool/repo"
import type {PageableData} from "~/types/data"
import {emitContributorInit} from "~/server/queue/contributor"
import { CommonError, ErrorCode } from "~/lib/error"


class DaoService {
  async search(params: HomeSearchParams, pageable: Pageable, userAddress: string | undefined) {
    const whereOptions: Prisma.DaoWhereInput = {}
    if (params.status) {
      whereOptions.status = {in: params.status}
    }
    if (params.starred && userAddress) {
      whereOptions.stars = {some: {userAddress}}
    }
    if (params.search) {
      whereOptions.name = {
        contains: params.search,
        mode: "insensitive"
      }
    }
    if (params.owned && userAddress) {
      whereOptions.tokenInfo = {
        OR: [
          {
            launchHolders: {
              some: {
                userAddress: {
                  equals: userAddress,
                  mode: "insensitive"
                },
                balance: {
                  gt: 0
                }
              }
            }
          },
          {
            graduationHolders: {
              some: {
                userAddress: {
                  equals: userAddress,
                  mode: "insensitive"
                },
                balance: {
                  gt: 0
                }
              }
            }
          }
        ]
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
            tokenId: true,
            tokenAddress: true,
            name: true,
            ticker: true,
            creator: true,
            isGraduated: true,
            createdAt: true,
            updatedAt: true,
            liquidity: true,
            price: true,
            marketCap: true,
            totalSupply: true,
            raisedAssetAmount: true,
            salesRatio: true,
            reservedRatio: true,
            unlockRatio: true,
            holderCount: true,
            assetTokenAddress: true,
            graduatedAt: true,
            uniswapV3Pair: true
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
      orderBy: params.orderBy === "latest" ? {createdAt: "desc"} : {marketCapUsd: "desc"}
    })
    const daoList = []
    for (const dao of data) {
      const {platform, owner, repo} = parseRepoUrl(dao.url)
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
      links.push({type: "x", value: params.x})
    }
    if (params.telegram) {
      links.push({type: "telegram", value: params.telegram})
    }
    if (params.discord) {
      links.push({type: "discord", value: params.discord})
    }
    if (params.website) {
      links.push({type: "website", value: params.website})
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
        status: DaoStatus.PRE_LAUNCH,
        platform: repoMeta.platform
      }
    })
    await emitContributorInit(dao.id, dao.url)
    return dao
    //TODO 刷新缓存
  }

  async repoInfo(url: string) {
    const repoMeta = parseRepoUrl(url)
    return await fetchRepoInfo(repoMeta.platform, repoMeta.owner, repoMeta.repo)
  }

  async repoContributors(url: string) {
    const repoMeta = parseRepoUrl(url)
    return await fetchAllRepoContributors(repoMeta.platform, repoMeta.owner, repoMeta.repo)
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
    }
    await db.daoStar.create({
      data: {
        daoId,
        userAddress
      }
    })
    return true
  }

  async findByUrl(url: string) {
    return await db.dao.findUnique({where: {url: url}})
  }

  async chart(tokenId: bigint, to: number, countBack: number, resolution: string) {
    let kineData = []
    if (resolution === "1") {
      kineData = await db.kLine1m.findMany({
        where: {
          tokenId,
          openTs: {
            lt: to
          }
        },
        orderBy: {
          openTs: "asc"
        },
        skip: 0,
        take: countBack
      })
    } else {
      kineData = await db.kLine5m.findMany({
        where: {
          tokenId,
          openTs: {
            lt: to
          }
        },
        orderBy: {
          openTs: "asc"
        },
        skip: 0,
        take: countBack
      })
    }

    const data: {
      time: number
      open: number
      high: number
      low: number
      close: number
      volume: number
    }[] = []

    data.push(
      ...kineData.map((item) => {
        return {
          time: Number(item.openTs) * 1000,
          open: Number(item.open),
          high: Number(item.high),
          low: Number(item.low),
          close: Number(item.close),
          volume: Number(item.volume)
        }
      })
    )

    return {data, noData: kineData.length < countBack}
  }

  async contents(daoId: string) {
    return await db.daoContent.findMany({
      where: {
        daoId
      },
      orderBy: {
        sort: "asc"
      }
    })
  }

  async detail(daoId: string, userAddress?: string) {
    const dao = await db.dao.findUnique({
      where: {
        id: daoId
      },
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
            tokenId: true,
            tokenAddress: true,
            name: true,
            ticker: true,
            creator: true,
            isGraduated: true,
            createdAt: true,
            updatedAt: true,
            liquidity: true,
            price: true,
            marketCap: true,
            totalSupply: true,
            raisedAssetAmount: true,
            salesRatio: true,
            reservedRatio: true,
            unlockRatio: true,
            holderCount: true,
            assetTokenAddress: true,
            graduatedAt: true,
            uniswapV3Pair: true
          }
        },
        contents: {
          select: {
            id: true,
            sort: true,
            title: true,
            type: true,
            data: true
          }
        },
        stars: {
          select: {
            userAddress: true
          }
        }
      }
    })
    if (!dao) {
      throw new Error("Not found dao!")
    }
    const {platform, owner, repo} = parseRepoUrl(dao.url)
    const repoInfo = await fetchRepoInfo(platform, owner, repo)
    return {
      ...dao,
      marketCapUsd: dao.marketCapUsd.toString(),
      priceUsd: dao.priceUsd.toString(),
      isStarred: dao.stars?.some((star) => star.userAddress === userAddress),
      stars: dao.stars?.length,
      repoStar: repoInfo.stargazers_count,
      repoWatch: repoInfo.watchers_count,
      repoIssues: repoInfo.open_issues_count,
      repoForks: repoInfo.forks_count,
      license: repoInfo.license?.spdx_id,
      tokenInfo: {
        ...dao.tokenInfo,
        marketCap: dao.tokenInfo.marketCap?.toString() ?? "",
        totalSupply: dao.tokenInfo.totalSupply?.toString() ?? "",
        holderCount: dao.tokenInfo.holderCount.toString(),
        liquidity: dao.tokenInfo.liquidity?.toString() ?? "",
        price: dao.tokenInfo.price?.toString() ?? "",
        unlockRatio: dao.tokenInfo.unlockRatio?.toString() ?? "",
        salesRatio: dao.tokenInfo.salesRatio?.toString() ?? "",
        raisedAssetAmount: dao.tokenInfo.raisedAssetAmount?.toString() ?? "",

      }
    }
  }

  async update(input: UpdateDaoParamsSchema, address: string) {
    const links: DaoLinks = []
    if (input.x) {
      links.push({type: "x", value: input.x})
    }
    if (input.telegram) {
      links.push({type: "telegram", value: input.telegram})
    }
    if (input.discord) {
      links.push({type: "discord", value: input.discord})
    }
    if (input.website) {
      links.push({type: "website", value: input.website})
    }

    return await db.dao.update({
      where: {
        id: input.daoId,
        createdBy: address
      },
      data: {
        avatar: input.avatar,
        description: input.description,
        links: links
      }
    })
  }
  async lockInfo(daoId:string){
    const dao=await db.dao.findUnique({
      where:{
        id:daoId
      },
      
    })
    if(!dao){
      throw new CommonError(ErrorCode.BAD_PARAMS,"")
    }
    dao.tokenId
  }
}

export type DaoSearchResult = Awaited<ReturnType<typeof daoService.search>>
export type DaoDetailResult = Awaited<ReturnType<typeof daoService.detail>>
export const daoService = new DaoService()
