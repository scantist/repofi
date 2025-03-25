import {TriangleAlert} from "lucide-react"
import {defaultChain, shortenAddress} from "~/lib/web3"
import {Button} from "~/components/ui/button"
import CopyButton from "~/components/ui/copy-button"
import type React from "react";

export function LoadingOverlay({
                                 sendingToken,
                                 receivingToken,
                                 approving,
                                 trading,
                                 approved,
                                 approvingText = "Approving spending cap",
                                 tradingText = "Processing trading transaction",
                                 approvedText = "Verifying trading transaction"
                               }: {
  sendingToken: {
    icon: React.ReactNode
  }
  receivingToken: {
    icon: React.ReactNode
  }
  approving: boolean
  trading: boolean
  approved: boolean
  approvingText?: string
  tradingText?: string
  approvedText?: string
}) {
  if (approving || trading || approved) {
    return (
      <div
        className="absolute -inset-2 z-30 flex flex-col items-center justify-center gap-6 bg-background/90 px-8 backdrop-blur">
        {/* <Loader2 className="size-12 animate-spin text-primary" /> */}
        <div className="flex items-center justify-center gap-8 pb-8">
          <div
            className="animate-swap-in flex size-16 overflow-clip rounded-full border border-primary/50 bg-background relative">{sendingToken.icon}</div>
          <div
            className="animate-swap-out size-16 overflow-clip rounded-full border border-primary/50 bg-background relative">{receivingToken.icon}</div>
        </div>
        <p className="text-center text-sm text-muted-foreground">
          {approving && approvingText}
          {trading && tradingText}
          {approved && approvedText}
        </p>
      </div>
    )
  }
  return null
}

export function ErrorOverlay({
                               approvingError,
                               tradingError,
                               approvingErrorText = "Fail to approve spending cap",
                               tradingErrorText = "Fail to carry out the trade action",
                               onReset
                             }: {
  approvingError: boolean
  tradingError: boolean
  approvingErrorText?: string
  tradingErrorText?: string
  onReset: () => void
}) {
  if (approvingError || tradingError) {
    return (
      <div
        className="absolute -inset-2 z-30 flex flex-col items-center justify-center gap-6 bg-background/90 px-8 backdrop-blur">
        <TriangleAlert className="size-12 text-red-500"/>
        {approvingError && <p className="text-center text-sm text-muted-foreground">{approvingErrorText}</p>}
        {tradingError && <p className="text-center text-sm text-muted-foreground">{tradingErrorText}</p>}
        <Button variant="secondary" className="mt-4" onClick={onReset}>
          Try Again
        </Button>
      </div>
    )
  }
  return null
}

export function SuccessOverlay({
                                 sendingToken,
                                 receivingToken,
                                 success,
                                 successText = "Token successfully swapped",
                                 transactionHash,
                                 onReset
                               }: {
  sendingToken: {
    icon: React.ReactNode
  }
  receivingToken: {
    icon: React.ReactNode
  }
  success: boolean
  successText?: string
  transactionHash: string
  onReset: () => void
}) {
  if (success) {
    return (
      <div
        className="absolute -inset-2 z-30 flex flex-col items-center justify-center gap-4 bg-background/90 px-8 backdrop-blur">
        <div className="flex items-center justify-center">
          <div
            className="flex size-16 translate-x-2 overflow-clip rounded-full border border-primary/50 bg-background relative">{sendingToken.icon}</div>
          <div
            className="size-16 -translate-x-2 overflow-clip rounded-full border border-primary/50 bg-background relative">{receivingToken.icon}</div>
        </div>
        <p className="text pb-2 pt-4 text-center font-medium text-foreground">{successText}</p>
        <p className="flex items-center gap-2 pb-6 text-center text-sm text-muted-foreground">
          Transaction:
          <a className="font-mono underline underline-offset-4"
             href={`${defaultChain.blockExplorers.default.url}/tx/${transactionHash}`} target="_blank" rel="noreferrer">
            {shortenAddress(transactionHash)}
          </a>
          <CopyButton content={transactionHash}/>
        </p>

        <Button variant="secondary" onClick={onReset}>
          Back to Trading
        </Button>
      </div>
    )
  }
  return null
}
