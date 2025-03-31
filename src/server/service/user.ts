import { type DaoPlatform, Prisma } from "@prisma/client"
import type { User } from "~/lib/zod"
import { db } from "~/server/db"
import { fetchUserInfo } from "~/server/tool/repo"

const generateReferralCode = (): string => {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 6)
  const code = (timestamp + randomPart).toUpperCase()
  return code.substring(0, 10)
}

class UserService {
  async createUser(address: string, referralCode?: string) {
    let referrer: User | null = null
    if (referralCode) {
      referrer = await db.user.findUnique({
        where: {
          referralCode
        }
      })
    }
    return await db.user.create({
      data: {
        address: address,
        name: address,
        referralCode: generateReferralCode(),
        invitedBy: referrer ? [referrer.address, ...referrer.invitedBy] : []
      }
    })
  }

  async getUserByAddress(address: string) {
    return await db.user.findUnique({
      where: {
        address: address
      },
      include: {
        userPlatforms: true
      }
    })
  }

  async bind(accessToken: string, platform: DaoPlatform, userAddress: string) {
    const user = await fetchUserInfo(accessToken, platform)
    await db.userPlatform.upsert({
      where: {
        userAddress_platform: {
          userAddress: userAddress,
          platform: platform
        }
      },
      update: {
        platformAvatar: user.avatar,
        platformName: user.name,
        platformId: user.id
      },
      create: {
        userAddress: userAddress,
        platform: platform,
        platformAvatar: user.avatar,
        platformName: user.name,
        platformId: user.id
      }
    })
  }
}
const userWithPlatforms = Prisma.validator<Prisma.UserDefaultArgs>()({ include: { userPlatforms: true } })
export type UserWithPlatforms = Prisma.UserGetPayload<typeof userWithPlatforms>
export const userService = new UserService()
