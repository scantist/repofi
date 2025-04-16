import { DaoContentType } from "@prisma/client"
import { env } from "process"
import { CommonError, ErrorCode } from "~/lib/error"
import type { DaoArticleParams, Pageable } from "~/lib/schema"
import { db } from "~/server/db"
import { daoService } from "~/server/service/dao"

class DaoArticleService {
  async create(daoId: string, params: DaoArticleParams, userAddress: string) {
    return await db.$transaction(async (tx) => {
      const dao = await tx.dao.findUnique({
        where: { id: daoId },
        include: { contents: true }
      })

      if (!dao) {
        throw new CommonError(ErrorCode.BAD_PARAMS, `Can't found ${daoId} dao`)
      }
      if (dao.createdBy !== userAddress) {
        throw new CommonError(ErrorCode.UNAUTHORIZED, "You are not authorized to create this article")
      }
      const daoArticle = await tx.daoArticle.create({
        data: {
          daoId,
          title: params.title,
          content: params.content
        }
      })
      const articleUrl = `${env.NEXT_PUBLIC_SITE_URL}/dao/${daoId}/article/${daoArticle.id}`
      let existingContent = dao.contents.find(content => content.type === DaoContentType.LIST_ROW)

      if (existingContent) {
        // Update existing content by adding new item to array
        const currentData = JSON.parse(existingContent.data as string) || []
        currentData.push({
          image: params.image,
          title: params.title,
          description: params.description,
          link: articleUrl
        })
        await tx.daoContent.update({
          where: { id: existingContent.id },
          data: { data: JSON.stringify(currentData) }
        })
      } else {
        // Create new content with initial array
        await tx.daoContent.create({
          data: {
            daoId,
            title: params.title,
            data: JSON.stringify([{
              image: params.image,
              title: params.title,
              description: params.description,
              link: articleUrl,
            }]),
            type: DaoContentType.LIST_ROW,
            sort: 0,
            enable: true
          }
        })
      }
      return daoArticle
    })
  }

  async update(daoArticleId: string, params: DaoArticleParams, userAddress: string) {
    return await db.$transaction(async (tx) => {
      // Find the article and verify permissions
      const daoArticle = await tx.daoArticle.findUnique({
        where: { id: daoArticleId },
        include: { dao: true }
      })

      if (!daoArticle) {
        throw new CommonError(ErrorCode.BAD_PARAMS, `Can't found ${daoArticleId} dao content`)
      }
      if (daoArticle.dao?.createdBy !== userAddress) {
        throw new CommonError(ErrorCode.UNAUTHORIZED, "You are not authorized to update this article")
      }

      // Find content that contains this article's link
      const articleUrl = `${env.NEXT_PUBLIC_SITE_URL}/dao/${daoArticle.daoId}/article/${daoArticleId}`
      const daoContent = await tx.daoContent.findFirst({
        where: {
          daoId: daoArticle.daoId,
          type: DaoContentType.LIST_ROW
        }
      })

      if (daoContent) {
        // Update the content data array
        const contentData = JSON.parse(daoContent.data as string) || []
        const articleIndex = contentData.findIndex((item: any) => item.link === articleUrl)
        
        if (articleIndex !== -1) {
          contentData[articleIndex] = {
            ...contentData[articleIndex],
            image: params.image,
            title: params.title,
            description: params.description
          }

          await tx.daoContent.update({
            where: { id: daoContent.id },
            data: { data: JSON.stringify(contentData) }
          })
        }
      }

      // Update the article itself
      return await tx.daoArticle.update({
        where: { id: daoArticleId },
        data: {
          title: params.title,
          content: params.content
        }
      })
    })
  }

  async page(daoId: string, pageable: Pageable) {
    const total = await db.daoArticle.count({
      where: { daoId }
    })
    const totalPages = Math.ceil(total / pageable.size)
    const actualPage = Math.max(0, Math.min(pageable.page, totalPages - 1))

    const articles = await db.daoArticle.findMany({
      where: { daoId },
      skip: actualPage * pageable.size,
      take: pageable.size,
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        content: true,
        updatedAt: true
      }
    })

    // 限制 content 字段大小为 200 个词
    const processedArticles = articles.map((article) => {
      const words = article.content.split(/\s+/) // 按空格分割为单词
      const truncatedContent = words.length > 200 ? `${words.slice(0, 200).join(" ")}...` : article.content
      return {
        ...article,
        content: truncatedContent
      }
    })

    return {
      list: processedArticles,
      total,
      pages: totalPages
    }
  }

  async detail(daoArticleId: string) {
    const daoArticle = await db.daoArticle.findUnique({
      where: { id: daoArticleId }
    })

    if (!daoArticle) {
      throw new CommonError(ErrorCode.BAD_PARAMS, `Can't found ${daoArticleId} dao content`)
    }
    return daoArticle
  }

  async delete(daoArticleId: string, userAddress: string) {
    const daoArticle = await db.daoArticle.findUnique({
      where: { id: daoArticleId },
      include: { dao: true }
    })

    if (!daoArticle) {
      throw new CommonError(ErrorCode.BAD_PARAMS, `Can't found ${daoArticleId} dao content`)
    }

    if (daoArticle.dao?.createdBy !== userAddress) {
      throw new CommonError(ErrorCode.UNAUTHORIZED, "You are not authorized to delete this article")
    }
    await db.daoArticle.delete({
      where: { id: daoArticleId }
    })
  }
}

export const daoArticleService = new DaoArticleService()
export type DaoArticleDetail = Awaited<ReturnType<typeof daoArticleService.detail>>
