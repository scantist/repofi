import { HydrateClient } from "~/trpc/server"
import WalletButton from "~/components/auth/wallet-button"
import { auth, signIn, signOut } from "~/server/auth"
import {Octokit} from "octokit"
import {getAccessToken, getGitHubClient, getGitLabClient} from "~/server/redis"

export default async function Home() {
  const session = await auth()
  console.log("session?.user?.platform", session?.provider)
  return (
    <HydrateClient>
      <main>
        <div>Main Page</div>
        <WalletButton />
        {session && (
          <form
            action={async () => {
              "use server"
              await signOut()
            }}
          >
            <div>Current session: {JSON.stringify(session.user)}</div>
            <div>Current platform: {session?.provider}</div>
            <button type="submit">Sign Out</button>
          </form>
        )}
        <form
          action={async () => {
            "use server"
            await signIn("github")
          }}
        >
          <button type="submit">Signin with GitHub</button>
        </form>

        <form
          action={async () => {
            "use server"
            await signIn("gitlab")
          }}
        >
          <button type="submit">Signin with Gitlab</button>
        </form>
        {session?.provider && session?.provider === "GitHub" && (
          <form
            action={async () => {
              "use server"
              if (session?.provider && session?.user?.email) {
                const octokit = await getGitHubClient(session?.user?.email)
                const {data} = await octokit.rest.repos.listForAuthenticatedUser({
                  type: "owner"
                })
                console.log(JSON.stringify(data))
              }
            }}
          >
            <button type="submit">Click me to get Github repo list!</button>
          </form>
        )}
        {session?.provider && session?.provider === "GitLab" && (
          <form
            action={async () => {
              "use server"
              if (session?.provider && session?.user?.email) {
                const gitlab = await getGitLabClient(session?.user?.email)
                const user = await gitlab?.Users.showCurrentUser()
                console.log(user)
              }
            }}
          >
            <button type="submit">Click me to get GitLab repo list!</button>
          </form>
        )}
      </main>
    </HydrateClient>
  )
}
