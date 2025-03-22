import type { DaoPlatform, DaoStatus, DaoType, Prisma } from "@prisma/client"
import { z } from "zod"
import { DaoContentParamsSchema } from "~/lib/schema"

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
  tokenId: bigint
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
    tokenAddress: string | null
    marketCap: string
    totalSupply: string
    holderCount: string
    assetTokenAddress: string | null
  }
}

export type FileUploader = (data: {
  file: string
  fileName: string
}) => Promise<{ success: boolean; url?: string; message?: string }>
export type CreateDaoStep = "BIND" | "INFORMATION" | "FINISH"

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
  .merge(DaoContentParamsSchema)

export type ListRowData = z.infer<typeof ListRowDataSchema>
export type ListRowContentParams = z.infer<typeof ListRowContentParamsSchema>

export const TeamDataSchema = z.object({
  name: z.string(),
  avatar: z.string(),
  x: z.string().url().optional(),
  website: z.string().url().optional(),
  telegram: z.string().url().optional(),
  github: z.string().url().optional(),
  ingress: z.string().url().optional(),
  description: z.string().optional(),
  title: z.string().optional(),
  sort: z.number()
})

export const TeamContentParamsSchema = z
  .object({
    data: z.array(ListRowDataSchema),
    id: z.string()
  })
  .merge(DaoContentParamsSchema)

export type TeamData = z.infer<typeof TeamDataSchema>
export type TeamContentParams = z.infer<typeof TeamContentParamsSchema>
