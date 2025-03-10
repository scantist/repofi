import { db } from "~/server/db"
import { type User } from "~/lib/zod"

const generateReferralCode = (): string => {
  const timestamp = Date.now().toString(36)
  const randomPart = Math.random().toString(36).substring(2, 6)
  const code = (timestamp + randomPart).toUpperCase()
  return code.substring(0, 10)
}

class UserService {
  async createUser(address: string,referralCode?:string) {
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
        }
      })
  }
}
export const userService = new UserService()
