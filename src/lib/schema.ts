"use client"
import { z } from "zod"
import { daoService } from "~/server/service/dao"
import { DaoContentTypeSchema, DaoPlatformSchema, DaoStatusSchema, DaoTypeSchema } from "~/lib/zod"

export const daoLinksSchema = z.array(
  z.object({
    type: z.enum(["x", "telegram", "discord", "website"]),
    value: z.string().url()
  }),
)


export const pageableSchema = z.object({
  page: z.number().optional().default(0),
  size: z.number().optional().default(12)
})

export const homeSearchParamsSchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(["latest", "marketCap"])
    .optional()
    .default("marketCap")
    .catch("marketCap"),
  status:z.array(DaoStatusSchema).optional(),
  owned: z.preprocess(
    (val) => val !== undefined && val !== "false",
    z.boolean().optional().default(false),
  ),
  starred: z.preprocess(
    (val) => val !== undefined && val !== "false",
    z.boolean().optional().default(false),
  )
})
export const DaoContentParamsSchema=z.object({
  title:z.string({ message:"Title is required." })
    .refine((value) => value.trim() !== "", {
      message: "Title can not be empty."
    }),
  sort:z.number().int().optional().default(0),
  type:DaoContentTypeSchema,
  data: z.object({})
})

export const createDaoParamsSchema = z.object({
  avatar: z
    .string({ message: "Avatar is required." })
    .refine((value) => value.trim() !== "", {
      message: "Avatar can not be empty."
    }),
  url: z.string({ message: "repo url is required." })
    .regex(/^https:\/\/(github\.com|gitlab\.com)\/[A-Za-z0-9_-]+\/[A-Za-z0-9_-]+$/,
      { message: "Only URLs from github.com or gitlab.com with the format https://github.com/xx/xxx are allowed." })
    // .refine(async (value) => {
    //   const repoInfo = await daoService.repoInfo(value)
    //   if (!repoInfo) {
    //     return true
    //   }
    // })
  ,
  type: DaoTypeSchema,
  name: z
    .string({ message: "Name is required." })
    .min(1, { message: "Name can not be empty." })
    // .refine(
    //   async (value) => {
    //     const nameExists = await daoService.checkNameExists(value)
    //     return !nameExists
    //   },
    //   { message: "Name already exists." },
    // )
  ,
  ticker: z
    .string({ message: "Ticker is required." })
    .min(1, { message: "Ticker can not be empty." })
    .regex(/^[A-Za-z]+$/, { message: "Only letters are allowed." })
    .transform((v) => v.toUpperCase())
    // .refine(
    //   async (value) => {
    //     const tickerExists = await daoService.checkTickerExists(value)
    //     return !tickerExists
    //   },
    //   { message: "Ticker already exists." },
    // )
  ,
  description: z
    .string({ message: "Description is required." })
    .min(1, { message: "Description can not be empty." }),
  x: z.string().url().optional().or(z.literal("")),
  telegram: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal(""))
})

export const launchSchema = z.object({
  totalSupply: z.bigint({ message: "Total Supply is required." }).min(1n, { message: "" }),
  raisedAssetAmount: z.bigint({ message: "Raised asset amount is required." }).min(1n, { message: "" }),
  salesRatio: z.number({ message: "Sales ratio is required." }).max(99, { message: "Max value is 99." }),
  reservedRatio: z.number({ message: "Reserved ratio is required." }).max(99, { message: "Max value is 99." }),
  assetToken: z.string({ message: "Asset token is Required." })
})

export const repoInfoSchema = z.object({
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
  license: z.object({
    spdx_id: z.string()
  })
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
    }),
  )
})
export type DaoContentParams =z.infer<typeof DaoContentParamsSchema>
export type DexPrice=z.infer<typeof dexPriceSchema>
export type RepoInfo = z.infer<typeof repoInfoSchema>
export type RepoMeta = z.infer<typeof repoMetaSchema>
export type RepoContributors = z.infer<typeof repoContributors>
export type RepoContributor = z.infer<typeof repoContributor>
export type HomeSearchParams = z.infer<typeof homeSearchParamsSchema>;
export type Pageable = z.infer<typeof pageableSchema>;
export type DaoLinks = z.infer<typeof daoLinksSchema>
export type CreateDaoParams = z.infer<typeof createDaoParamsSchema>
export type LaunchParams = z.infer<typeof launchSchema>
