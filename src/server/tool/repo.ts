import { Octokit } from "octokit"
import { env } from "~/env"
import { CommonError, ErrorCode } from "~/lib/error"
import { z } from "zod"
import { unstable_cache as cache } from "next/cache"
const repoInfoSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  description: z.string(),
  fork: z.boolean(),
  created_at: z.string(),
  updated_at: z.string(),
  pushed_at: z.string(),
  homepage: z.string().nullable(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  open_issues_count: z.number(),
  forks_count: z.number(),
  watchers: z.number(),
  network_count: z.number(),
  subscribers_count: z.number(),
  owner: z.object({
    login: z.string(),
    id: z.number(),
    type: z.string(),
    avatar_url: z.string()
  }),
  organization: z.object({
    login: z.string(),
    id: z.number(),
    avatar_url: z.string(),
    type: z.string()
  }),
  license:z.object({
    spdx_id:z.string()
  })
})

const RepoMetaSchema=z.object({
  platform: z.enum(["github", "gitlab"]),
  owner: z.string(),
  repo: z.string()
})
export type RepoMeta = z.infer<typeof RepoMetaSchema>

class OctokitPool {
  private readonly pool: Octokit[]

  constructor(tokens: string[]) {
    this.pool = tokens.map(token => new Octokit({ auth: token }))
  }

  getClient(): Octokit {
    if (this.pool.length === 0) {
      throw new CommonError(ErrorCode.INTERNAL_ERROR, "Octokit pool is empty")
    }
    return this.pool[Math.floor(Math.random() * this.pool.length)]!
  }
}
const octokitPool = new OctokitPool(env.TOOL_REPO_GITHUB_ACCESS_TOKENS)

export async function fetchRepoInfo(platform:string,owner: string, repo: string ) {
  return cache(
    async () => {
      if(platform === "github") {
        const client = octokitPool.getClient()
        const response = await client.rest.repos.get({ owner, repo })
        const safeParse = repoInfoSchema.safeParse(response.data)
        if (!safeParse.success) {
          console.error(
            `[Tool/Github] Invalid response format from server: ${safeParse.error.toString()}`,
          )
          throw new CommonError(ErrorCode.INTERNAL_ERROR, "Invalid response format from github info server")
        }
        return safeParse.data
      }
    },
    [`tool-repo-github-info-${platform}-${owner}-${repo}`],
    {
      revalidate: 60 * 60 * 24, // 24 hours
      tags: ["tool-repo-github-info"]
    }
  )()
}

export function parseRepoUrl(url: string): RepoMeta {
  const regex = /^https:\/\/(github|gitlab)\.com\/([^/]+)\/([^/]+)\/?$/
  const match = regex.exec(url)

  if (!match) {
    throw new CommonError(ErrorCode.BAD_PARAMS, "Invalid repository URL. Must be a GitHub or GitLab URL.")
  }

  const [, platform, owner, repo] = match

  const result = {
    owner,
    repo,
    platform: platform as "github" | "gitlab"
  }

  return RepoMetaSchema.parse(result)
}
