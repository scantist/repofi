import { assetTokenRouter } from "~/server/api/routers/asset-token"
import { contributorRouter } from "~/server/api/routers/contributor"
import { daoRouter } from "~/server/api/routers/dao"
import { daoContentRouter } from "~/server/api/routers/dao-content"
import { messageRouter } from "~/server/api/routers/dao-message"
import { holderRouter } from "~/server/api/routers/holder"
import { postRouter } from "~/server/api/routers/post"
import { repoRouter } from "~/server/api/routers/repo"
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc"
import { dashboardRouter } from "~/server/api/routers/dashboard";
import { userRouter } from "~/server/api/routers/user";
import { daoArticleRouter } from "./routers/dao-article"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  dao: daoRouter,
  repo: repoRouter,
  assetToken: assetTokenRouter,
  message: messageRouter,
  contributor: contributorRouter,
  holder: holderRouter,
  daoContent: daoContentRouter,
  dashboard: dashboardRouter,
  user: userRouter,
  daoArticle: daoArticleRouter
})

// export type definition of API
export type AppRouter = typeof appRouter

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter)
