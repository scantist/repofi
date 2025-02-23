import NextAuth, { type DefaultSession, type User } from "next-auth"
import { db } from "~/server/db"
import Credentials from "next-auth/providers/credentials"
import {
  getAddressFromMessage,
  getChainIdFromMessage,
  verifySignature
} from "@reown/appkit-siwe"
import { createUser } from "~/server/data/user"
import GitHub from "next-auth/providers/github"
import GitLab, { type GitLabProfile } from "next-auth/providers/gitlab"
import {getRedis} from "~/server/redis"

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    address: string;
    chainId: number;
    role: "ADMIN" | "USER";
    provider?: "GitHub" | "GitLab";
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: "jwt"
  },
  callbacks: {
    session: (params) => {
      const { session, token } = params
      if (session.user) {
        session.provider = session.user.image?.includes("github") ? "GitHub" : "GitLab"
      }
      if (!token.sub) {
        return session
      }
      const [, chainId, address] = token.sub.split(":")
      if (chainId && address) {
        session.address = address
        session.chainId = parseInt(chainId, 10)
      }

      if (token.role) {
        session.role = token.role as "ADMIN" | "USER"
      }
      return session
    },
    jwt: async ({ token, account }) => {
      if (account?.access_token && token?.email) {
        const redis = getRedis()
        if (account.expires_at && account.created_at) {
          const expire = account.expires_at - (account.created_at as number)
          await redis.set(`AC_${account.provider}_${token.email}`.toUpperCase(), account.access_token, "EX", expire)
        } else {
          await redis.set(`AC_${account.provider}_${token.email}`.toUpperCase(), account.access_token)
        }
      }
      if (token.sub) {
        const [, , address] = token.sub.split(":")
        if (address) {
          const u = await db.user.findUnique({
            where: {
              address
            }
          })
          if (u) {
            token.address = u.address
            token.name = u.name
            token.role = u.role
          }
        }
      }
      return token
    }
  },
  providers: [
    GitHub({
      profile: (profile) => {
        return {
          id: profile.id.toString(),
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url
        }
      }
    }),
    GitLab({
      profile: (profile: GitLabProfile) => {
        return {
          id: profile.id.toString(),
          name: profile.name,
          email: profile.email,
          image: profile.avatar_url
        }
      }
    }),
    Credentials({
      name: "Ethereum",
      credentials: {
        message: {
          label: "Message",
          type: "text",
          placeholder: "0x0"
        },
        signature: {
          label: "Signature",
          type: "text",
          placeholder: "0x0"
        }
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.message) {
            throw new Error("SiweMessage is undefined")
          }

          const { message, signature } = credentials
          const address = getAddressFromMessage(message as string)
          const chainId = getChainIdFromMessage(message as string)

          const isValid = await verifySignature({
            address,
            message: message as string,
            signature: signature as string,
            chainId,
            projectId: "d198cf7bba856bb5f9a7ec73cb03235e"
          })

          if (isValid) {
            const currentUser = await db.user.findUnique({
              where: {
                address: address
              }
            })

            if (!currentUser) {
              await createUser(address)
            }

            return {
              id: `${chainId}:${address}`
            }
          }

          return null
        } catch (e) {
          console.error(e)
          return null
        }
      }
    })
  ]
})

export async function getApiKey(
  apiKey: string | null,
) {
  if (!apiKey) {
    return null
  }

  const apiKeyDb = await db.apiKey.findUnique({ where: { key: apiKey } })

  if (apiKeyDb?.userAddress) {
    const user = await db.user.findUnique({
      where: {
        address: apiKeyDb.userAddress
      }
    })

    if (user) {
      return { user }
    }

    // const agent = await db.agent.findUnique({
    //   where: {
    //     walletAddress: apiKeyDb.userAddress,
    //   },
    // });
    //
    // if (agent) {
    //   return { agent };
    // }
  }

  return null
}
