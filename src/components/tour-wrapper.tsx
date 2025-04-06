"use client"

import { type StepType, TourProvider } from "@reactour/tour"
import type React from "react"

export const TourWrapper = ({ children }: { children: React.ReactNode }) => {
  const steps: StepType[] = [
    {
      selector: ".banner",
      content: "This is your DAO basic information.",
      position: "center"
    },
    {
      selector: ".action",
      content: "You can get actions for the DAO.",
      position: "center"
    },
    {
      selector: ".token-info",
      content: "The block is your DAO token information.",
      position: "center"
    },
    {
      selector: ".progress",
      content: "The block is your DAO current progress.",
      position: "bottom"
    },
    {
      selector: ".progress",
      content: "The block is your DAO current progress.",
      position: "bottom"
    },
    {
      selector: ".trade-view",
      content: "The block is your DAO trade view.",
      position: "bottom"
    },
    {
      selector: ".trading",
      content: "You can trade the DAO token.",
      position: "bottom"
    },
    {
      selector: ".contributor",
      content: "The block is your repo contributor rank.",
      position: "top"
    },
    {
      selector: ".distribution",
      content: "The block is your DAO token distribution.",
      position: "top"
    },
    {
      selector: ".message-board",
      content: "You can communicate with your DAO members.",
      position: "top"
    }
  ]

  return (
    <TourProvider
      steps={steps}
      styles={{
        popover: (base) => ({ ...base, background: "#000", border: "1px solid gray", borderRadius: "8px" }),
        close: (base) => ({ ...base, left: "auto", right: 8, top: 8 })
      }}
      onClickMask={({ setCurrentStep, currentStep, steps, setIsOpen }) => {
        if (steps) {
          if (currentStep === steps.length - 1) {
            setIsOpen(false)
          }
          setCurrentStep((s) => (s === steps.length - 1 ? 0 : s + 1))
        }
      }}
    >
      {children}
    </TourProvider>
  )
}
