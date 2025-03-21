"use client"

import { type OpenOptions } from "node_modules/@reown/appkit/dist/types/src/client/appkit-base-client"
import { type ReactNode } from "react"
import { useAuth } from "./auth-context"

export default function SignedOut({
  children
}: {
  children:
    | ReactNode
    | ((props: {
        openDialog: (options?: OpenOptions) => Promise<void>
      }) => ReactNode)
}) {
  const { isAuthenticated, openDialog } = useAuth()

  return !isAuthenticated ? (typeof children === "function" ? children({ openDialog }) : children) : null
}
