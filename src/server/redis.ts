import { Redis } from "ioredis"
import { env } from "~/env"
import { Octokit } from "octokit"
import { Gitlab } from "@gitbeaker/rest"
export const connection = {
  host: env.REDIS_HOST,
  port: parseInt(env.REDIS_PORT),
  db: parseInt(env.REDIS_DB),
  password: env.REDIS_PASSWORD
}

let redis: Redis

export const getRedis = () => {
  if (!redis) {
    redis = new Redis(connection)
  }
  return redis
}

export const getAccessToken = async (provider: "GitHub" | "GitLab", email: string) => {
  const redis = getRedis()
  return redis.get(`AC_${provider}_${email}`.toUpperCase())
}

export const getGitHubClient = async (email: string) => {
  const accessToken = await getAccessToken("GitHub", email)
  return new Octokit({ auth: accessToken })
}

export const getGitLabClient = async (email: string) => {
  const accessToken = await getAccessToken("GitLab", email)
  if (accessToken) {
    return new Gitlab({ oauthToken: accessToken })
  }
  return null
}
