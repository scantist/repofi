"use client"

import { Wallet2 } from "lucide-react"
import { type ReactNode } from "react"
import { shortenAddress } from "~/lib/web3"
import { Button } from "../ui/button"
import SignedIn from "./signed-in"
import SignedOut from "./signed-out"
import WalletAvatar from "./wallet-avatar"
import { type OpenOptions } from "node_modules/@reown/appkit/dist/types/src/client"

export default function WalletButton({
  children
}: {
  children?:
    | ReactNode
    | ((props: {
        address: string;
        openDialog: (options?: OpenOptions) => Promise<void>;
      }) => ReactNode);
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
            <Button
              variant="outline"
              onClick={() => openDialog({ view: "Account" })}
              className="gap-2"
            >
              <WalletAvatar account={address} size={20} className="size-5" />
              <span>{shortenAddress(address)}</span>
            </Button>
          )
        }
      </SignedIn>
      <SignedOut>
        {({ openDialog }) => (
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => openDialog()}
          >
            <Wallet2 className="size-5" />
            Connect
          </Button>
        )}
      </SignedOut>
    </>
  )
}
