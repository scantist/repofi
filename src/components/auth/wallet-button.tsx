"use client"

import { Wallet2 } from "lucide-react"
import type { OpenOptions } from "node_modules/@reown/appkit/dist/types/src/client/appkit-base-client"
import type { ReactNode } from "react"
import { shortenAddress } from "~/lib/web3"
import { Button } from "../ui/button"
import SignedIn from "./signed-in"
import SignedOut from "./signed-out"
import WalletAvatar from "./wallet-avatar"

export default function WalletButton({
  children,
  connectChildren,
  variant = "outline"
}: {
  children?:
    | ReactNode
    | ((props: {
        address: string
        openDialog: (options?: OpenOptions) => Promise<void>
      }) => ReactNode)
  connectChildren?:
    | ReactNode
    | ((props: {
        openDialog: (options?: OpenOptions) => Promise<void>
      }) => ReactNode)
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}) {
  return (
    <>
      <SignedIn>
        {({ address, openDialog }) =>
          children !== undefined ? (
            typeof children === "function" ? (
              children({ address, openDialog })
            ) : (
              children
            )
          ) : (
            <Button variant={variant} onClick={() => openDialog({ view: "Account" })} className="gap-2">
              <WalletAvatar account={address} size={20} className="size-5" />
              <span>{shortenAddress(address)}</span>
            </Button>
          )
        }
      </SignedIn>
      <SignedOut>
        {({ openDialog }) =>
          connectChildren !== undefined ? (
            typeof connectChildren === "function" ? (
              connectChildren({ openDialog })
            ) : (
              connectChildren
            )
          ) : (
            <Button variant={variant} className="gap-2" onClick={() => openDialog()}>
              <Wallet2 className="size-5" />
              Connect
            </Button>
          )
        }
      </SignedOut>
    </>
  )
}
