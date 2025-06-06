import { z } from "zod"
import { AssetTokenSchema, DaoContentTypeSchema, DaoPlatformSchema, DaoStatusSchema, DaoTypeSchema } from "~/lib/zod"
import { daoService } from "~/server/service/dao"

export const daoLinksSchema = z.array(
  z.object({
    type: z.enum(["x", "telegram", "discord", "website"]),
    value: z.string().url()
  })
)

export const pageableSchema = z.object({
  page: z.number().optional().default(0),
  size: z.number().optional().default(12)
})

export const homeSearchParamsSchema = z.object({
  search: z.string().optional(),
  orderBy: z.enum(["latest", "marketCap"]).optional().default("marketCap").catch("marketCap"),
  status: z.array(DaoStatusSchema).optional(),
  owned: z.boolean().optional().default(false),
  starred: z.boolean().optional().default(false)
})
export const daoContentParamsSchema = z.object({
  title: z.string({ message: "Title is required." }).refine((value) => value.trim() !== "", {
    message: "Title can not be empty."
  }),
  sort: z.number().int().optional().default(0),
  type: DaoContentTypeSchema,
  data: z.any(),
  enable: z.boolean().default(true)
})

export const daoArticleParamsSchema = z.object({
  title: z.string({ message: "Title is required." }).refine((value) => value.trim() !== "", {
    message: "Title can not be empty."
  }),
  description: z.string({ message: "Description is required." }).refine((value) => value.trim() !== "", {
    message: "Description can not be empty."
  }),
  image: z.string({ message: "Image is required." }).refine((value) => value.trim() !== "", {
    message: "Image can not be empty."
  }),
  content: z.string({ message: "Content is required." }).refine((value) => value.trim() !== "", {
    message: "Content can not be empty."
  }),
})

export const createDaoParamsSchema = z.object({
  avatar: z.string({ message: "Avatar is required." }).refine((value) => value.trim() !== "", {
    message: "Avatar can not be empty."
  }),
  url: z.string({ message: "repo url is required." }),
  type: DaoTypeSchema,
  name: z.string({ message: "Name is required." }).min(1, { message: "Name can not be empty." }),
  ticker: z
    .string({ message: "Ticker is required." })
    .min(1, { message: "Ticker can not be empty." })
    .regex(/^[A-Za-z]+$/, { message: "Only letters are allowed." })
    .transform((v) => v.toUpperCase()),
  description: z.string({ message: "Description is required." }).min(1, { message: "Description can not be empty." }),
  x: z.string().url().optional().or(z.literal("")),
  telegram: z.string().url().optional().or(z.literal("")),
  discord: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal(""))
})
export const updateDaoParamsSchema = z.object({
  daoId: z.string({ message: "DAO id is required." }),
  avatar: z.string({ message: "Avatar is required." }).refine((value) => value.trim() !== "", {
    message: "Avatar can not be empty."
  }),
  description: z.string({ message: "Description is required." }).min(1, { message: "Description can not be empty." }),
  x: z.string().url().optional().or(z.literal("")),
  telegram: z.string().url().optional().or(z.literal("")),
  discord: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal(""))
})
export const launchSchema = z.object({
  totalSupply: z.bigint({ message: "Total Supply is required." }).min(1n, { message: "Total Supply is required." }),
  raisedAssetAmount: z.bigint({ message: "Raised asset amount is required." }).min(1n, { message: "Raised asset amount is required." }),
  salesRatio: z.number({ message: "Sales ratio is required." }).min(0, { message: "Min value is 0." }).max(100, { message: "Max value is 100." }),
  reservedRatio: z.number({ message: "Reserved ratio is required." }).min(0, { message: "Min value is 0." }).max(100, { message: "Max value is 100." }),
  assetToken: z.string({ message: "Asset token must select!" })
})

export const repoInfoSchema = z.object({
  name: z.string(),
  full_name: z.string(),
  description: z.string().nullable().default(""),
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
  license: z
    .object({
      spdx_id: z.string()
    })
    .nullable()
    .transform((license) => license ?? { spdx_id: "unknown" })
})

export const repoMetaSchema = z.object({
  platform: DaoPlatformSchema,
  owner: z.string(),
  repo: z.string()
})

export const repoContributor = z.object({
  id: z.string(),
  contributions: z.number(),
  name: z.string(),
  avatar: z.string()
})
export const repoContributors = z.array(repoContributor)

export const dexPriceSchema = z.object({
  pairs: z.array(
    z.object({
      chainId: z.string(),
      priceNative: z.string().transform(Number),
      priceUsd: z.string().transform(Number),
      priceChange: z.object({
        h1: z.number().optional(),
        h6: z.number().optional(),
        h24: z.number().optional()
      }),
      marketCap: z.number()
    })
  )
})
export type UpdateDaoParamsSchema = z.infer<typeof updateDaoParamsSchema>
export type DaoContentParams = z.infer<typeof daoContentParamsSchema>
export type DaoArticleParams = z.infer<typeof daoArticleParamsSchema>
export type DexPrice = z.infer<typeof dexPriceSchema>
export type RepoInfo = z.infer<typeof repoInfoSchema>
export type RepoMeta = z.infer<typeof repoMetaSchema>
export type RepoContributors = z.infer<typeof repoContributors>
export type RepoContributor = z.infer<typeof repoContributor>
export type HomeSearchParams = z.infer<typeof homeSearchParamsSchema>
export type Pageable = z.infer<typeof pageableSchema>
export type DaoLinks = z.infer<typeof daoLinksSchema>
export type CreateDaoParams = z.infer<typeof createDaoParamsSchema>
export type LaunchParams = z.infer<typeof launchSchema>
