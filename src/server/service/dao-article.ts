import {CommonError, ErrorCode} from "~/lib/error"
import type {DaoArticleParams, Pageable} from "~/lib/schema"
import {db} from "~/server/db"

class DaoArticleService {
  async create(daoId: string, params: DaoArticleParams, userAddress: string) {
    const dao = await db.dao.findUnique({
      where: {id: daoId}
    })
    if (!dao) {
      throw new CommonError(ErrorCode.BAD_PARAMS, `Can't found ${daoId} dao`)
    }
    if (dao.createdBy !== userAddress) {
      throw new CommonError(ErrorCode.UNAUTHORIZED, "You are not authorized to create this article")
    }
    return await db.daoArticle.create({
      data: {
        daoId,
        title: params.title,
        content: params.content
      }
    })
  }

  async update(daoArticleId: string, params: DaoArticleParams, userAddress: string) {
    const daoArticle = await db.daoArticle.findUnique({
      where: {id: daoArticleId},
      include: {dao: true}
    })
    if (!daoArticle) {
      throw new CommonError(ErrorCode.BAD_PARAMS, `Can't found ${daoArticleId} dao content`)
    }
    if (daoArticle.dao?.createdBy !== userAddress) {
      throw new CommonError(ErrorCode.UNAUTHORIZED, "You are not authorized to delete this article");
    }
    return await db.daoArticle.update({
      where: {id: daoArticleId},
      data: {
        title: params.title,
        content: params.content
      }
    })
  }

  async page(daoId: string, pageable: Pageable) {
    const total = await db.daoArticle.count({
      where: {daoId},
    });
    const totalPages = Math.ceil(total / pageable.size);
    const actualPage = Math.max(0, Math.min(pageable.page, totalPages - 1));

    const articles = await db.daoArticle.findMany({
      where: {daoId},
      skip: actualPage * pageable.size,
      take: pageable.size,
      orderBy: {updatedAt: "desc"},
      select: {
        id: true,
        title: true,
        content: true,
        updatedAt: true,
      },
    });

// 限制 content 字段大小为 200 个词
    const processedArticles = articles.map((article) => {
      const words = article.content.split(/\s+/); // 按空格分割为单词
      const truncatedContent =
        words.length > 200 ? `${words.slice(0, 200).join(" ")}...` : article.content;
      return {
        ...article,
        content: truncatedContent,
      };
    });

    return {
      list: processedArticles,
      total,
      pages: totalPages,
    };
  }

  async detail(daoArticleId: string) {
    const daoArticle = await db.daoArticle.findUnique({
      where: {id: daoArticleId},
    });

    if (!daoArticle) {
      throw new CommonError(ErrorCode.BAD_PARAMS, `Can't found ${daoArticleId} dao content`);
    }
    return daoArticle;
  }

  async delete(daoArticleId: string, userAddress: string) {
    const daoArticle = await db.daoArticle.findUnique({
      where: {id: daoArticleId},
      include: {dao: true},
    });

    if (!daoArticle) {
      throw new CommonError(ErrorCode.BAD_PARAMS, `Can't found ${daoArticleId} dao content`);
    }

    if (daoArticle.dao?.createdBy !== userAddress) {
      throw new CommonError(ErrorCode.UNAUTHORIZED, "You are not authorized to delete this article");
    }
    await db.daoArticle.delete({
      where: {id: daoArticleId},
    });
  }
}

export const daoArticleService = new DaoArticleService()
