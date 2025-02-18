
import { HydrateClient } from "~/trpc/server"

export default async function Home() {

  return (
    <HydrateClient>
      <main>
        <div>Main Page</div>
      </main>
    </HydrateClient>
  )
}
