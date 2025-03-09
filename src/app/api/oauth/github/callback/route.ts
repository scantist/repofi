"use server"

import type { OAuth2Tokens } from "arctic"
import { github } from "~/server/oauth"
import { cookies } from "next/headers"

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const cookieStore = await cookies()
  const storedState = cookieStore.get("github_oauth_state")?.value ?? null
  if (
    code === null ||
    state === null ||
    storedState === null ||
    storedState === undefined
  ) {
    return new Response(null, {
      status: 400
    })
  }
  if (state !== storedState) {
    return new Response(null, {
      status: 400
    })
  }

  let tokens: OAuth2Tokens
  try {
    tokens = await github.validateAuthorizationCode(code)
  } catch (e) {
    // Invalid code or client credentials
    return new Response(null, {
      status: 400
    })
  }
  const accessToken = tokens.accessToken()
  let rollback = cookieStore.get("github_rollback")?.value ?? null
  if (!rollback) {
    rollback = "/"
  }
  cookieStore.set("github_token", accessToken)
  return new Response(null, {
    status: 302,
    headers: {
      Location: rollback
    }
  })
}
