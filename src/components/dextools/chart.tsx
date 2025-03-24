"use client"

import type { ChartDrawingToolbars, ChartResolution, ChartTheme, ChartType } from "./type"

function DextoolsChart({
  pair,
  chainId,
  theme = "dark",
  chartType = 1,
  chartResolution = "30",
  drawingToolbars = "false"
}: {
  pair: string
  chainId: string
  theme?: ChartTheme
  chartType?: ChartType
  chartResolution?: ChartResolution
  drawingToolbars?: ChartDrawingToolbars
}) {
  return (
    <iframe
      id="dextools-widget"
      title="DEXTools Trading Chart"
      width="100%"
      height="100%"
      src={`https://www.dextools.io/widget-chart/en/${chainId}/pe-light/${pair}?theme=${theme}&chartType=${chartType}&chartResolution=${chartResolution}&drawingToolbars=${drawingToolbars}`}
    />
  )
}

export default DextoolsChart
