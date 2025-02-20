import { HydrateClient } from "~/trpc/server"
import WalletButton from "~/components/auth/wallet-button"
import { auth, signIn, signOut } from "~/server/auth"

export default async function Home() {
  const session = await auth()
  console.log("session?.user?.platform", session?.provider)
  return (
    <HydrateClient>
      <main>
        <div>Main Page</div>
        <WalletButton />
        {session && <form
          action={async () => {
            "use server"
            await signOut()
          }}
        >
          <div>Current session: {JSON.stringify(session.user)}</div>
          <div>Current platform: {session?.provider}</div>
          <button type="submit">Sign Out</button>
        </form>}
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
      </main>
    </HydrateClient>
  )
}
