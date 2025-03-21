import { db } from "~/server/db"
import { type AssetToken } from "@prisma/client"

class AssetTokenService {
  async getAssetTokens(): Promise<Array<Omit<AssetToken, "priceUsd"> & { priceUsd: string }>> {
    const data = await db.assetToken.findMany({
      where: {
        isValid: true,
        isAllowed: true
      }
    })

    return data.map((item) => ({
      ...item,
      priceUsd: item.priceUsd.toString()
    }))
  }
}

export const assetTokenService = new AssetTokenService()
