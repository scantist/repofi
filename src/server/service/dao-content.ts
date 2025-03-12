import { type DaoContentParams } from "~/lib/schema"
import { db } from "~/server/db"
import { CommonError, ErrorCode } from "~/lib/error"

class DaoContentService {
  async create(daoId: string, params: DaoContentParams) {
    const dao = await db.dao.findUnique({
      where: { id: daoId }
    })
    if (!dao) {
      throw new CommonError(ErrorCode.BAD_PARAMS, `Can't found ${daoId} dao`)
    }
    await db.daoContent.create({
      data: {
        daoId,
        title: params.title,
        data: params.data,
        type: params.type,
        sort: params.sort
      }
    })
  }

  async update(daoContentId: string, params: DaoContentParams) {
    const daoContent = await db.daoContent.findUnique({
      where: { id: daoContentId }
    })
    if (!daoContent) {
      throw new CommonError(
        ErrorCode.BAD_PARAMS,
        `Can't found ${daoContentId} dao content`,
      )
    }
    await db.daoContent.update({
      where: { id: daoContentId },
      data: {
        title: params.title,
        data: params.data,
        type: params.type,
        sort: params.sort
      }
    })
  }
}
export const daoContentService = new DaoContentService()
