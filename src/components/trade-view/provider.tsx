"use client"

import type { IChartingLibraryWidget } from "public/static/charting_library/charting_library"
import { createContext, useContext, useState } from "react"

// This context and provider is used to offer a way to store:
// - The callback function provided by the TradingView widget during initialization (subscribeBars)
// - The widget itself
// So we can use it to reload the chart data on demand.

type TradingViewContext = {
  chartWidget: IChartingLibraryWidget | null
  setChartWidget: (chartWidget: IChartingLibraryWidget) => void
  resetCallback: (() => void) | null
  setResetCallback: (resetCallback: (() => void) | null) => void
}

export const TradingViewContext = createContext<TradingViewContext | null>(null)

export const TradingViewProvider = ({
  children
}: {
  children: React.ReactNode
}) => {
  const [resetCallback, setResetCallback] = useState<(() => void) | null>(null)
  const [chartWidget, setChartWidget] = useState<IChartingLibraryWidget | null>(null)

  return (
    <TradingViewContext.Provider
      value={{
        chartWidget,
        resetCallback,
        setResetCallback,
        setChartWidget
      }}
    >
      {children}
    </TradingViewContext.Provider>
  )
}

export const useTradingView = () => {
  const context = useContext(TradingViewContext)
  if (!context) {
    throw new Error("useTradingView must be used within a TradingViewProvider")
  }
  return context
}
