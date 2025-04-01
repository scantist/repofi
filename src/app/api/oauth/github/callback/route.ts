"use server"

import type { OAuth2Tokens } from "arctic"
import { cookies } from "next/headers"
import { github } from "~/server/oauth"

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const state = url.searchParams.get("state")
  const cookieStore = await cookies()
  const storedState = cookieStore.get("github_oauth_state")?.value ?? null
  let rollback = cookieStore.get("github_rollback")?.value ?? null
  if (!rollback) {
    rollback = "/"
  }
  console.log("storedState", storedState, rollback)
  const error = url.searchParams.get("error")
  const errorDescription = url.searchParams.get("error_description")

  const redirectWithError = (error: string, errorDescription: string) => {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${rollback}?error=${error}&error_description=${errorDescription}`
      }
    })
  }

  if (error !== null) {
    if (error === "access_denied") {
      return redirectWithError(error, "You have rejected our authorization request for your GitHub account.")
    }
    return redirectWithError(error, errorDescription || "")
  }

  if (code === null || state === null || storedState === null || storedState === undefined) {
    return redirectWithError("invalid_request", "Missing required parameters")
  }

  if (state !== storedState) {
    return redirectWithError("invalid_state", "State mismatch")
  }

  let tokens: OAuth2Tokens
  try {
    tokens = await github.validateAuthorizationCode(code)
  } catch (e) {
    // Invalid code or client credentials
    return redirectWithError("invalid_grant", "Failed to validate authorization code")
  }

  const accessToken = tokens.accessToken()
  cookieStore.set("github_token", accessToken)
  return new Response(null, {
    status: 302,
    headers: {
      Location: rollback
    }
  })
}
