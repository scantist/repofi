import { CommonError, ErrorCode } from "~/lib/error"
import type { DaoContentParams } from "~/lib/schema"
import { db } from "~/server/db"

class DaoContentService {
  async create(daoId: string, params: DaoContentParams, userAddress: string) {
    const dao = await db.dao.findUnique({
      where: { id: daoId }
    })
    if (!dao) {
      throw new CommonError(ErrorCode.BAD_PARAMS, `Can't found ${daoId} dao`)
    }
    if (dao.createdBy !== userAddress) {
      throw new CommonError(ErrorCode.UNAUTHORIZED, "You are not authorized to create this content")
    }
    return await db.daoContent.create({
      data: {
        daoId,
        title: params.title,
        data: params.data,
        type: params.type,
        sort: params.sort,
        enable: params.enable
      }
    })
  }

  async update(daoContentId: string, params: DaoContentParams, userAddress: string) {
    const daoContent = await db.daoContent.findUnique({
      where: { id: daoContentId },
      include: { dao: true }
    })
    if (!daoContent) {
      throw new CommonError(ErrorCode.BAD_PARAMS, `Can't found ${daoContentId} dao content`)
    }
    if (daoContent.dao?.createdBy !== userAddress) {
      throw new CommonError(ErrorCode.UNAUTHORIZED, "You are not authorized to update this content")
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
