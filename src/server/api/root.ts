import { postRouter } from "~/server/api/routers/post"
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc"
import { daoRouter } from "~/server/api/routers/dao"
import { repoRouter } from "~/server/api/routers/repo"
import { assetTokenRouter } from "~/server/api/routers/asset-token"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  dao: daoRouter,
  repo: repoRouter,
  assetToken: assetTokenRouter
})

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
