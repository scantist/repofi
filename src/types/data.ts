import {
  type DaoType,
  type DaoPlatform,
  type DaoStatus,
  type Prisma
} from "@prisma/client"

export interface Repository {
  id:number,
  url: string,
  name: string;
  description: string;
  star: number;
  fork: number;
  watch: number;
  license: string;
}

export interface PageableData<T> {
  list: T[]
  total: number
}

export interface DaoPage {
  id: string;
  name: string;
  url: string;
  ticker: string;
  type: DaoType;
  description: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  walletAddress: string | null;
  tokenAddress: string;
  links: Prisma.JsonValue;
  status: DaoStatus;
  platform: DaoPlatform;
  marketCapUsd: string;
  priceUsd: string;
  isStarred: boolean;
  repoStar: number;
  repoWatch: number;
  repoIssues: number;
  repoForks: number;
  license: string;
  info: {
    tokenAddress: string;
    marketCap: string;
    totalSupply: string;
    holderCount: string;
    assetTokenAddress: string;
  };
}
