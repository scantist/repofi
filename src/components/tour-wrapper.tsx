"use client"

import { type StepType, TourProvider } from "@reactour/tour"
import type React from "react"

export const TourWrapper = ({ children }: { children: React.ReactNode }) => {
  const steps: StepType[] = [
    {
      selector: ".banner",
      content: "This is your DAO basic information.",
      position: "center"
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
