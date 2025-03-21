"use client"

import { type Session } from "next-auth"
import { SessionProvider as NextAuthSessionProvider } from "next-auth/react"
import React from "react"
import { WagmiProvider, type State as WagmiState } from "wagmi"
import { wagmiConfig } from "./config"
import { AuthContextProvider } from "./auth-context"

export default function AuthProvider({
  children,
  session,
  wagmiState
}: {
  children: React.ReactNode
  session?: Session | null
  wagmiState?: WagmiState
}) {
  return (
    <NextAuthSessionProvider session={session}>
      <WagmiProvider config={wagmiConfig} initialState={wagmiState}>
        <AuthContextProvider>{children}</AuthContextProvider>
      </WagmiProvider>
    </NextAuthSessionProvider>
  )
}
