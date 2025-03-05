import { env } from "~/env"
import { db } from "~/server/db"

class AssetTokenService{
  async getAssetTokens() {
    const chainId = env.NEXT_PUBLIC_CHAIN_ID

    console.log(
      "[Service/AssetToken] loading asset token list from DB for chainId",
      chainId,
    )

    const data = await db.assetToken.findMany({
      where: {
        chainId
      }
    })

    return data.map((item) => {
      return {
        ...item,
        priceUsd: item.priceUsd.toString()
      }
    })
  };
}

export const assetTokenService=new AssetTokenService()
