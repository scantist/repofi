import type { DaoPlatform, DaoStatus, DaoType, Prisma } from "@prisma/client"
import { z } from "zod"
import { daoContentParamsSchema } from "~/lib/schema"

export interface Repository {
  id: number
  url: string
  name: string
  description: string
  star: number
  fork: number
  watch: number
  license: string
}

export interface PageableData<T> {
  list: T[]
  pages: number
  total: number
}

export interface DaoPage {
  id: string
  name: string
  url: string
  ticker: string
  type: DaoType
  description: string
  avatar: string
  createdAt: Date
  updatedAt: Date
  createdBy: string
  tokenId: bigint | null
  links: Prisma.JsonValue
  status: DaoStatus
  platform: DaoPlatform
  marketCapUsd: string
  priceUsd: string
  isStarred: boolean
  repoStar: number
  repoWatch: number
  repoIssues: number
  repoForks: number
  license: string
  tokenInfo: {
    tokenAddress?: string | null
    marketCap?: string
    totalSupply?: string
    holderCount?: string
    assetTokenAddress?: string | null
  }
}

export type FileUploader = (data: {
  file: string
  fileName: string
}) => Promise<{ success: boolean; url?: string; message?: string }>

export const ListRowDataSchema = z.object({
  image: z.string().min(1, { message: "Image URL cannot be empty" }),
  title: z.string().min(1, { message: "Title cannot be empty" }).max(100, { message: "Title cannot exceed 100 characters" }),
  sort: z.number().int({ message: "Sort must be an integer" }).nonnegative({ message: "Sort must be a non-negative number" }),
  description: z.string().max(500, { message: "Description cannot exceed 500 characters" }),
  link: z.string().url({ message: "Please enter a valid URL" })
})

export const ListRowContentParamsSchema = z
  .object({
    data: z.array(ListRowDataSchema),
    id: z.string()
  })
  .merge(daoContentParamsSchema)

export type ListRowData = z.infer<typeof ListRowDataSchema>
export type ListRowContentParams = z.infer<typeof ListRowContentParamsSchema>

export const TeamDataSchema = z.object({
  name: z.string(),
  avatar: z.string(),
  x: z.preprocess((val) => (val === "" ? undefined : val), z.string().url().optional()),
  website: z.preprocess((val) => (val === "" ? undefined : val), z.string().url().optional()),
  telegram: z.preprocess((val) => (val === "" ? undefined : val), z.string().url().optional()),
  github: z.preprocess((val) => (val === "" ? undefined : val), z.string().url().optional()),
  ingress: z.preprocess((val) => (val === "" ? undefined : val), z.string().url().optional()),
  description: z.string().optional(),
  title: z.string().optional(),
  sort: z.number()
})

export const TeamContentParamsSchema = daoContentParamsSchema.merge(
  z.object({
    data: z.array(TeamDataSchema),
    id: z.string()
  })
)

export type TeamData = z.infer<typeof TeamDataSchema>
export type TeamContentParams = z.infer<typeof TeamContentParamsSchema>

export const RoadmapSchema = z.object({
  date: z.string().date(),
  description: z.string().optional()
})

export const RoadmapParamsSchema = z
  .object({
    data: z.array(RoadmapSchema),
    id: z.string()
  })
  .merge(daoContentParamsSchema)

export type RoadmapData = z.infer<typeof RoadmapSchema>
export type RoadmapContentParams = z.infer<typeof RoadmapParamsSchema>

export const InformationDataSchema = z.object({
  information: z.string(),
  image: z.string()
})

export const InformationContentParamsSchema = daoContentParamsSchema.merge(
  z.object({
    data: InformationDataSchema,
    id: z.string()
  })
)

export type InformationData = z.infer<typeof InformationDataSchema>
export type InformationContentParams = z.infer<typeof InformationContentParamsSchema>
