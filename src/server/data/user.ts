import { db } from "~/server/db"

const generateReferralCode = async () => {
  let code = Math.random().toString(36).substring(2, 12).toUpperCase()
  const user = await db.user.findUnique({
    where: {
      referralCode: code
    }
  })

  if (user) {
    code = await generateReferralCode()
  }
  return code
}

export const createUser = async (address: string) => {
  const code = await generateReferralCode()
  const u = await db.user.create({
    data: {
      address: address,
      name: address,
      referralCode: code
    }
  })

  return u
}
