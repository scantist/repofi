/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */
import { TRPCError, initTRPC } from "@trpc/server"
import superjson from "superjson"
import { ZodError, z } from "zod"

import type { UserRole } from "@prisma/client"
import { CommonError } from "~/lib/error"
import { auth, getApiKey } from "~/server/auth"
import { db } from "~/server/db"

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth()
  if (session) {
    return {
      db,
      session,
      ...opts
    }
  }
  const entity = await getApiKey(opts.headers.get("x-api-key"))
  return {
    db,
    session:
      entity && "user" in entity
        ? {
            address: entity.user.address,
            user: entity.user,
            role: entity.user.role
          }
        : undefined,
    ...opts
  }
}

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null
      }
    }
  }
})

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now()

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100
    await new Promise((resolve) => setTimeout(resolve, waitMs))
  }

  const result = await next()

  const end = Date.now()
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`)

  return result
})

const errorHandlerMiddleware = t.middleware(async ({ next }) => {
  const resp = await next()
  if (!resp.ok) {
    const error = resp.error.cause
    if (error instanceof CommonError) {
      throw new TRPCError({
        code:
          error.code === "UNAUTHORIZED"
            ? "UNAUTHORIZED"
            : error.code === "NOT_FOUND"
              ? "NOT_FOUND"
              : error.code === "INVALID_STATE" || error.code === "BAD_PARAMS"
                ? "BAD_REQUEST"
                : "INTERNAL_SERVER_ERROR",
        message: error.description,
        cause: error.cause
      })
    }
  }
  return resp
})
const protectionMiddleware = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user }
    }
  })
})

/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware)

export const protectedProcedure = t.procedure.use(timingMiddleware).use(async ({ ctx, next }) => {
  if (!ctx.session?.address) {
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  return next({ ctx })
})
export const identifyRole = (roles: UserRole[]) => {
  return t.middleware(async ({ ctx, next }) => {
    for (const role of roles) {
      if (ctx.session?.role === role) {
        return next({ ctx: ctx })
      }
    }
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `Role unauthorized. Only supports: ${roles.join(", ")}`
    })
  })
}

export const protectedUserDaoProcedure = t.procedure
  .use(timingMiddleware)
  .use(errorHandlerMiddleware)
  // .use(apiAccessMiddleware)
  .use(protectionMiddleware)
  .input(z.object({ daoId: z.string() }))
  .use(async (opts) => {
    const { ctx, next, input } = opts

    const { daoId } = input

    const dao = await db.dao.findUnique({
      where: { id: daoId }
    })

    if (dao && dao.createdBy === ctx.session.address) {
      return next({
        ctx: {
          ...ctx,
          agent: dao
        }
      })
    }

    throw new TRPCError({
      code: "BAD_REQUEST",
      message: "Missing DAO info or DAO not found"
    })
  })
