import { type DaoType, type DaoPlatform, type DaoStatus, type Prisma } from "@prisma/client"

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
