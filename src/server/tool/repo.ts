import { Octokit } from "octokit"
import { Gitlab } from "@gitbeaker/rest"
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
  homepage: z.string().nullable(),
  stargazers_count: z.number(),
  watchers_count: z.number(),
  open_issues_count: z.number(),
  forks_count: z.number(),
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
      if (platform === "github") {
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
      } else if (platform === "gitlab") {
        const client = new Gitlab({})
        if (!client) {
          throw new CommonError(ErrorCode.INTERNAL_ERROR, "Failed to initialize GitLab client")
        }
        const response = await client.Projects.show(`${owner}/${repo}`)
        const safeParse = repoInfoSchema.safeParse({
          name: response.name,
          full_name: response.path_with_namespace,
          description: response.description,
          fork: response.forked_from_project !== null,
          created_at: response.created_at,
          updated_at: response.last_activity_at,
          homepage: response.web_url,
          stargazers_count: response.star_count,
          watchers_count: response.star_count, // GitLab uses star_count for both
          open_issues_count: response.open_issues_count,
          forks_count: response.forks_count,
          owner: {
            login: response.namespace.path,
            id: response.namespace.id,
            type: response.namespace.kind,
            avatar_url: response.namespace.avatar_url
          },
          organization: {
            login: response.namespace.path,
            id: response.namespace.id,
            avatar_url: response.namespace.avatar_url,
            type: response.namespace.kind
          },
          license: {
            spdx_id: response.license?.key || "unknown"
          }
        })
        if (!safeParse.success) {
          console.error(
            `[Tool/GitLab] Invalid response format from server: ${safeParse.error.toString()}`,
          )
          throw new CommonError(ErrorCode.INTERNAL_ERROR, "Invalid response format from gitlab info server")
        }
        return safeParse.data
      } else {
        throw new CommonError(ErrorCode.BAD_PARAMS, "Unsupported platform. Must be 'github' or 'gitlab'.")
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

