import { GitHub } from "arctic"
import { env } from "~/env"

export const github = new GitHub(env.AUTH_GITHUB_ID, env.AUTH_GITHUB_SECRET, null)
