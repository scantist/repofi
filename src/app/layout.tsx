import "~/styles/globals.css"

import { cookieToInitialState } from "@wagmi/core"
import { GeistSans } from "geist/font/sans"
import type { Metadata } from "next"
import { headers } from "next/headers"
import Link from "next/link"
import type React from "react"
import { Toaster } from "sonner"
import AuthProvider from "~/components/auth/auth-provider"
import { wagmiConfig } from "~/components/auth/config"
import WalletButton from "~/components/auth/wallet-button"
import ToTop from "~/components/common/to-top"
import LogoRepoIcon from "~/components/icons/logo-repo-icon"
import Nav from "~/components/nav"
import { QueryClientReactProvider } from "~/components/query-client/query-client-provider"
import { Badge } from "~/components/ui/badge"
import { env } from "~/env"
import { auth } from "~/server/auth"
import { TRPCReactProvider } from "~/trpc/react"
import { PHProvider } from "~/components/common/posthog-provider"

// const sans = Space_Grotesk({
//   subsets: ["latin"],
//   variable: "--font-sans"
// })
// const mono = Space_Mono({
//   subsets: ["latin"],
//   weight: ["400", "700"],
//   variable: "--font-mono"
// })

const socialMedias = [
  {
    title: "Twitter / X",
    type: "x",
    href: "https://x.com/REPO_Protocol"
  },
  {
    title: "Discord",
    type: "discord",
    href: "https://t.me/REPOProtocol"
  },
  {
    title: "Telegram",
    type: "telegram",
    href: "https://discord.gg/59hEPnGwT7"
  }
]

export const metadata: Metadata = {
  title: "Repo Launch Hub",
  description: "The Repo Protocol Launch Hub",
  icons: [{ rel: "icon", url: "https://storage.googleapis.com/repofi-prod/launchpad/image/logo.png" }]
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const session = await auth()
  const wagmiState = cookieToInitialState(wagmiConfig, (await headers()).get("cookie"))
  const version = "BETA"
  const hash = env.NEXT_PUBLIC_GIT_SHA?.slice(0, 7) ?? "DEV"

  return (
    <html lang="en" className={`dark ${GeistSans.variable}`}>
      <body className={"font-sans dark"}>
        <PHProvider>
          <QueryClientReactProvider>
            <TRPCReactProvider>
              <AuthProvider session={session} wagmiState={wagmiState}>
                <Toaster />
                <div className={"relative flex min-h-screen w-full flex-col bg"}>
                  <header className="fixed top-0 z-30 mx-auto flex h-20 w-full items-center justify-between px-4">
                    <div className="mx-auto flex w-full max-w-7xl items-center justify-between p-4 pr-0">
                      <Link className={"flex flex-row gap-2 items-center"} href="/">
                        <LogoRepoIcon className="text-primary size-12" />
                        <div className={"text-3xl font-bold tracking-tighter"}>REPO Protocol</div>
                      </Link>
                      <div className="">
                        <Nav />
                      </div>
                      <div className="hidden items-center gap-4 md:flex">
                        <WalletButton />
                      </div>
                    </div>
                    <div
                      className="from-background pointer-events-none absolute inset-0 -z-10 h-[200%] bg-black/80 bg-gradient-to-b to-transparent backdrop-blur"
                      style={{
                        maskImage: "linear-gradient(to bottom, black 0% 50%, transparent 50% 100%)"
                      }}
                    />
                  </header>
                  <main className="relative flex grow flex-col overflow-clip">{children}</main>
                  <footer className="h-24 backdrop-blur bg-black">
                    <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between gap-0 px-8 md:px-4">
                      <div className="flex items-center gap-6">
                        <ToTop className="group flex flex-row gap-2 items-center">
                          <LogoRepoIcon className="size-12 text-primary transition-all group-hover:-rotate-45 group-hover:text-foreground" />
                        </ToTop>

                        <Badge variant="outline" className="font-mono text-xs font-normal text-muted-foreground">
                          {version}
                        </Badge>
                        <Badge variant="outline" className="hidden">
                          {hash}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 sm:gap-8">
                        {socialMedias.map((item, idx) => (
                          <div key={idx} className="group flex cursor-pointer items-center gap-2">
                            <Link href={item.href} target="_blank" className="hidden group-hover:text-primary sm:block">
                              {item.title}
                            </Link>
                          </div>
                        ))}
                      </div>
                    </div>
                  </footer>
                </div>
              </AuthProvider>
            </TRPCReactProvider>
          </QueryClientReactProvider>
        </PHProvider>
      </body>
    </html>
  )
}
