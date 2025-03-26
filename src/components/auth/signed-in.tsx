"use client"

import type { OpenOptions } from "node_modules/@reown/appkit/dist/types/src/client/appkit-base-client"
import type { ReactNode } from "react"
import { useAuth } from "./auth-context"

export default function SignedIn({
  children
}: {
  children:
    | ReactNode
    | ((props: {
        address: string
        openDialog: (options?: OpenOptions) => Promise<void>
      }) => ReactNode)
}) {
  const { isAuthenticated, openDialog, address } = useAuth()

  return isAuthenticated ? (typeof children === "function" ? children({ address, openDialog }) : children) : null
}
