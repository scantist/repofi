import { z } from "zod"
import { CommonError } from "~/lib/error"

const repositoryInfoSchema = z.object({
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
  })
})

const repositoryContributorsSchema = z.array(
  z.object({
    login: z.string(),
    id: z.number(),
    avatar_url: z.string(),
    url: z.string(),
    type: z.string(),
    contributions: z.number()
  }),
)
type Contributor = z.infer<typeof repositoryContributorsSchema>[number];

async function fetchRepositoryInfo(owner: string, repo: string) {
  const url = `https://api.github.com/repos/${owner}/${repo}`
  try {
    const response = await fetch(url)
    if (!response.ok) {
      console.error(
        `[Tool/Github] Failed to fetch repository info: ${response.status} ${response.statusText}`,
      )
      throw new CommonError(
        "INTERNAL_ERROR",
        `Failed to create account: ${response.status} ${response.statusText}`,
      )
    }
    const parsedResponse = repositoryInfoSchema.safeParse(
      await response.json(),
    )

    if (!parsedResponse.success) {
      console.error(
        `[Tool/Github] Invalid response format from server: ${parsedResponse.error.toString()}`,
      )
      throw new CommonError(
        "INTERNAL_ERROR",
        "Invalid response format from github info server",
      )
    }

    return parsedResponse.data
  } catch (error) {
    console.error("Failed to fetch repository stats:", error)
    return null
  }
}

async function fetchRepositoryContributors(owner: string, repo: string) {
  let allContributors: Contributor[] = []
  let page = 1
  const perPage = 100
  while (true) {
    const url = `https://api.github.com/repos/${owner}/${repo}/contributors?per_page=${perPage}&page=${page}`
    try {
      const response = await fetch(url)
      if (!response.ok) {
        console.error(
          `[Tool/Github] Failed to fetch repository contributors: ${response.status} ${response.statusText}`,
        )
        throw new CommonError(
          "INTERNAL_ERROR",
          `Failed to fetch repository contributors: ${response.status} ${response.statusText}`,
        )
      }

      const parsedResponse = repositoryContributorsSchema.safeParse(
        await response.json(),
      )

      if (!parsedResponse.success) {
        console.error(
          `[Tool/Github] Invalid response format from server: ${parsedResponse.error.toString()}`,
        )
        throw new CommonError(
          "INTERNAL_ERROR",
          "Invalid response format from github contributors server",
        )
      }

      allContributors = allContributors.concat(parsedResponse.data)

      if (parsedResponse.data.length < perPage) {
        break // No more pages left
      }
      page++ // Go to the next page
    } catch (error) {
      console.error("[Tool/Github] Failed to fetch repository contributors:", error)
      return null
    }
  }
  return allContributors
}

