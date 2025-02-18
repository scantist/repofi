import "~/styles/globals.css"

import { GeistSans } from "geist/font/sans"
import { type Metadata } from "next"
import { QueryClientReactProvider } from "~/components/query-client/query-client-provider"
import { TRPCReactProvider } from "~/trpc/react"
import { cookieToInitialState } from "@wagmi/core"
import { auth } from "~/server/auth"
import { wagmiConfig } from "~/components/auth/config"
import { headers } from "next/headers"
import AuthProvider from "~/components/auth/auth-provider"

export const metadata: Metadata = {
  title: "Create T3 App",
  description: "Generated by create-t3-app",
  icons: [{ rel: "icon", url: "/favicon.ico" }]
}

export default async function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  const wagmiState = cookieToInitialState(
    wagmiConfig,
    (await headers()).get("cookie"),
  )
  return (
    <html lang="en" className={`${GeistSans.variable}`}>
      <body>
        <QueryClientReactProvider>
          <TRPCReactProvider>
            <AuthProvider session={session} wagmiState={wagmiState}>
              {children}
            </AuthProvider>
          </TRPCReactProvider>
        </QueryClientReactProvider>
      </body>
    </html>
  )
}
