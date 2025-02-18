"use client"

import { type OpenOptions } from "node_modules/@reown/appkit/dist/types/src/client"
import { createContext, useContext } from "react"
import { useAppKit, useAppKitAccount } from "@reown/appkit/react"
import { useSession } from "next-auth/react"
import { type ReactNode } from "react"
// import posthog from "posthog-js"

type AuthContextProps =
  | {
      isAuthenticated: true;
      address: string;
      openDialog: (options?: OpenOptions) => Promise<void>;
    }
  | {
      isAuthenticated: false;
      address: null;
      openDialog: (options?: OpenOptions) => Promise<void>;
    };

export const AuthContext = createContext<AuthContextProps | null>(null)

export function AuthContextProvider({ children }: { children: ReactNode }) {
  const { status: sessionStatus } = useSession()
  const { address, isConnected } = useAppKitAccount()
  const { open } = useAppKit()

  const isAuthenticated =
    sessionStatus === "authenticated" && isConnected && !!address

  // 用户行为记录 https://posthog.com/docs/libraries/js
  // if (isAuthenticated) {
  //   posthog.identify(address)
  // }

  return (
    <AuthContext.Provider
      value={
        {
          isAuthenticated,
          openDialog: open,
          address: address
        } as AuthContextProps
      }
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
