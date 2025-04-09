import { createEnv } from "@t3-oss/env-nextjs"
import { isAddress } from "viem"
import { z } from "zod"

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    REDIS_HOST: z.string(),
    REDIS_PORT: z.string().regex(/^\d+$/),
    REDIS_DB: z.string().regex(/^\d+$/),
    REDIS_PASSWORD: z.string(),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    AUTH_GITHUB_SECRET: z.string(),
    AUTH_GITHUB_ID: z.string(),
    AUTH_GITLAB_SECRET: z.string(),
    AUTH_GITLAB_ID: z.string(),
    CHAIN_RPC_URL: z
      .preprocess(
        (val) => {
          if (typeof val !== "string") {
            return {}
          }
          // val is in the format of "<chainId>:<rpcUrl>;<chainId>:<rpcUrl>;"
          const chainRpcMap = val.split(";").reduce((acc, curr) => {
            const [chainId, rpcUrl] = curr.split("|")
            if (chainId && rpcUrl) {
              return Object.assign(acc, { [chainId]: rpcUrl })
            }
            return acc
          }, {})
          return chainRpcMap
        },
        z.record(z.string(), z.string().url())
      )
      .optional(),
    TOOL_REPO_GITHUB_ACCESS_TOKENS: z.string(),
    GOOGLE_APPLICATION_CREDENTIALS: z.string(),
    GOOGLE_STORAGE_BUCKET: z.string().optional().default("repofi"),
    CONTRACT_POC_ADDRESS: z.string().refine((v) => isAddress(v), "Invalid poc address"),
    CONTRACT_TOKENLOCKER_ADDRESS: z.string().refine((v) => isAddress(v), "Invalid tokenlocker address")
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // https://cloud.reown.com
    NEXT_PUBLIC_REOWN_PROJECT_ID: z.string(),
    NEXT_PUBLIC_CHAIN_ID: z.preprocess((val) => Number(val), z.number()),
    NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS: z.string().refine((v) => isAddress(v), "Invalid launchpad address"),
    NEXT_PUBLIC_CONTRACT_QUOTER_ADDRESS: z.string().refine((v) => isAddress(v), "Invalid quoter address"),
    NEXT_PUBLIC_CONTRACT_V3_FACTORY_ADDRESS: z.string().refine((v) => isAddress(v), "Invalid factory address"),
    NEXT_PUBLIC_CONTRACT_SWAP_ROUTER_ADDRESS: z.string().refine((v) => isAddress(v), "Invalid swap router address"),
    NEXT_PUBLIC_GIT_SHA: z.string().optional()
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_HOST: process.env.REDIS_HOST,
    REDIS_PORT: process.env.REDIS_PORT,
    REDIS_DB: process.env.REDIS_DB,
    REDIS_PASSWORD: process.env.REDIS_PASSWORD,
    GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    GOOGLE_STORAGE_BUCKET: process.env.GOOGLE_STORAGE_BUCKET,
    CHAIN_RPC_URL: process.env.CHAIN_RPC_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_REOWN_PROJECT_ID: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
    NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_LAUNCHPAD_ADDRESS,
    NEXT_PUBLIC_CONTRACT_QUOTER_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_QUOTER_ADDRESS,
    NEXT_PUBLIC_CONTRACT_SWAP_ROUTER_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_SWAP_ROUTER_ADDRESS,
    NEXT_PUBLIC_CONTRACT_V3_FACTORY_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_V3_FACTORY_ADDRESS,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITLAB_SECRET: process.env.AUTH_GITLAB_SECRET,
    AUTH_GITLAB_ID: process.env.AUTH_GITLAB_ID,
    TOOL_REPO_GITHUB_ACCESS_TOKENS: process.env.TOOL_REPO_GITHUB_ACCESS_TOKENS,
    CONTRACT_POC_ADDRESS: process.env.CONTRACT_POC_ADDRESS,
    CONTRACT_TOKENLOCKER_ADDRESS: process.env.CONTRACT_TOKENLOCKER_ADDRESS,
    NEXT_PUBLIC_GIT_SHA: process.env.NEXT_PUBLIC_GIT_SHA
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially
   * useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
  /**
   * Makes it so that empty strings are treated as undefined. `SOME_VAR: z.string()` and
   * `SOME_VAR=''` will throw an error.
   */
  emptyStringAsUndefined: true
})
