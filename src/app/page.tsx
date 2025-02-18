
import { HydrateClient } from "~/trpc/server"
import WalletButton from "~/components/auth/wallet-button"

export default async function Home() {

  return (
    <HydrateClient>
      <main>
        <div>Main Page</div>
        <WalletButton />
      </main>
    </HydrateClient>
  )
}
