"use client"
import { getAddress } from "viem"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import { env } from "~/env"
import { type AppKitNetwork, base, sepolia } from "@reown/appkit/networks"
import { createAppKit } from "@reown/appkit/react"
import { type SIWECreateMessageArgs, type SIWESession, type SIWEVerifyMessageArgs, createSIWEConfig, formatMessage } from "@reown/appkit-siwe"
import { getCsrfToken, getSession, signIn, signOut } from "next-auth/react"
const W_COIN_ADDRESSES: Record<number, `0x${string}`> = {
  [base.id]: "0x4200000000000000000000000000000000000006", // Base Mainnet WETH
  [sepolia.id]: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14" // Sepolia WETH
} as const
const isMainNet = env.NEXT_PUBLIC_CHAIN_ID === base.id
const defaultChain = isMainNet ? base : sepolia
const defaultWCoinAddress = W_COIN_ADDRESSES[defaultChain.id]
const projectId = env.NEXT_PUBLIC_REOWN_PROJECT_ID
const networks: [AppKitNetwork, ...AppKitNetwork[]] = [defaultChain]

//Set up the Wagmi Adapter (Config)
const wagmiAdapter = new WagmiAdapter({
  ssr: true,
  projectId,
  networks
})
const wagmiConfig = wagmiAdapter.wagmiConfig
// Normalize the address (checksum)
const normalizeAddress = (address: string): string => {
  try {
    const splitAddress = address.split(":")
    const extractedAddress = splitAddress[splitAddress.length - 1]
    if (!extractedAddress) {
      return address
    }

    splitAddress[splitAddress.length - 1] = getAddress(extractedAddress)
    return splitAddress.join(":")
  } catch (error) {
    console.error(error)
    return address
  }
}

const metadata = {
  name: "REPO",
  description: "The Repo Protocol",
  url: "https://repofi.io/",
  icons: [] // TODO: Add icons
}
const siweConfig = createSIWEConfig({
  getMessageParams: async () => ({
    domain: typeof window !== "undefined" ? window.location.host : "",
    uri: typeof window !== "undefined" ? window.location.origin : "",
    chains: networks.map((chain: AppKitNetwork) => Number.parseInt(chain.id.toString())),
    statement: "Please sign with your account"
  }),
  createMessage: ({ address, ...args }: SIWECreateMessageArgs) => formatMessage(args, normalizeAddress(address)),
  getNonce: async () => {
    const nonce = await getCsrfToken()
    if (!nonce) {
      throw new Error("Failed to get nonce!")
    }

    return nonce
  },
  getSession: async () => {
    const session = await getSession()
    if (!session) {
      return null
    }

    // Validate address and chainId types
    if (typeof session.address !== "string" || typeof session.chainId !== "number") {
      return null
    }
    return {
      address: session.address,
      chainId: session.chainId
    } satisfies SIWESession
  },
  verifyMessage: async ({ message, signature }: SIWEVerifyMessageArgs) => {
    try {
      await signIn("credentials", {
        message,
        signature,
        redirect: false
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  },
  signOut: async () => {
    try {
      await signOut({
        redirect: false
      })
      return true
    } catch (error) {
      console.error(error)
      return false
    }
  }
})

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  themeVariables: {
    "--w3m-font-family": "var(--font-sans)",
    "--w3m-accent": "#84cc16"
  },
  // featuredWalletIds: [
  // "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96",
  // "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709",
  // "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4",
  // "1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369",
  // ],
  features: {
    swaps: false,
    onramp: false,
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false,
    socials: false
  },
  siweConfig
  // tokens
})

export { wagmiConfig, defaultChain, defaultWCoinAddress }
