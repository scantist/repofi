import { createEnv } from "@t3-oss/env-nextjs"
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
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    AUTH_GITHUB_SECRET: z.string(),
    AUTH_GITHUB_ID: z.string(),
    AUTH_GITLAB_SECRET: z.string(),
    AUTH_GITLAB_ID: z.string(),
    TOOL_REPO_GITHUB_ACCESS_TOKENS: z.string().transform(str =>
        str.split(";").map(s => s.trim()).filter(Boolean)
    )
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // https://cloud.reown.com
    NEXT_PUBLIC_REOWN_PROJECT_ID: z.string(),
    NEXT_PUBLIC_CHAIN_ID: z.preprocess((val) => Number(val), z.number())
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
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_CHAIN_ID: process.env.NEXT_PUBLIC_CHAIN_ID,
    NEXT_PUBLIC_REOWN_PROJECT_ID: process.env.NEXT_PUBLIC_REOWN_PROJECT_ID,
    AUTH_GITHUB_SECRET: process.env.AUTH_GITHUB_SECRET,
    AUTH_GITHUB_ID: process.env.AUTH_GITHUB_ID,
    AUTH_GITLAB_SECRET: process.env.AUTH_GITLAB_SECRET,
    AUTH_GITLAB_ID: process.env.AUTH_GITLAB_ID,
    TOOL_REPO_GITHUB_ACCESS_TOKENS: process.env.TOOL_REPO_GITHUB_ACCESS_TOKENS
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
