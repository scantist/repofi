import { generateState } from "arctic"
import { github } from "~/server/oauth"
import { cookies } from "next/headers"
import { type NextRequest } from "next/server"
import { auth } from "~/server/auth"

export async function GET(request: NextRequest): Promise<Response> {
  const session = await auth()
  if (!session) {
    new Response(JSON.stringify({ message: "No authorization!" }), {
      status: 401
    })
  }
  const state = generateState()
  const url = github.createAuthorizationURL(state, ["repo","read:org"])
  const cookieStore = await cookies()
  cookieStore.set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: "lax"
  })
  const rollbackUrl = request.nextUrl.searchParams.get("rollbackUrl")
  if (rollbackUrl) {
    cookieStore.set("github_rollback", rollbackUrl)
  }
  if (session?.address) {
    cookieStore.set("auth_address", session?.address)
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: url.toString()
    }
  })
}
