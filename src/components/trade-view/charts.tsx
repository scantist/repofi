"use client"

import {
  type ChartingLibraryWidgetOptions,
  type LibrarySymbolInfo,
  type ResolutionString,
  type SearchSymbolResultItem,
  type Timezone,
  widget
} from "public/static/charting_library"
import { useEffect, useRef } from "react"
import { getAgentChartDataAction } from "./actions"
import { useTradingView } from "./provider"

export const TVChartContainer = ({
  dao
}: {
  dao: {
    tokenId: bigint
    name: string
    ticker: string
  }
}) => {
  const chartContainerRef = useRef<HTMLDivElement>(null)

  const { setResetCallback, setChartWidget } = useTradingView()

  useEffect(() => {
    const chartContainer = chartContainerRef.current
    if (!chartContainer) return

    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: dao.ticker,
      interval: "1" as ResolutionString,
      container: chartContainerRef.current!,
      library_path: "/static/charting_library/",
      theme: "dark",
      locale: "en",
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
      disabled_features: ["use_localstorage_for_settings", "header_symbol_search", "symbol_search_hot_key", "header_compare"],
      enabled_features: ["study_templates"],
      charts_storage_url: "https://saveload.tradingview.com",
      charts_storage_api_version: "1.1",
      client_id: "tradingview.com",
      user_id: "public_user_id",
      fullscreen: false,
      autosize: true,
      time_frames: [{ text: "1D", resolution: "1" as ResolutionString, description: "1D" }],
      datafeed: {
        onReady: (callback) => {
          setTimeout(() =>
            callback({
              supported_resolutions: ["1", "5"] as ResolutionString[]
            })
          )
        },
        searchSymbols: (userInput: string, exchange: string, symbolType: string, onResultReadyCallback: (result: SearchSymbolResultItem[]) => void) => {
          onResultReadyCallback([])
        },
        resolveSymbol: (symbolName: string, onSymbolResolvedCallback: (symbol: LibrarySymbolInfo) => void) => {
          setTimeout(() => {
            onSymbolResolvedCallback({
              name: dao.name,
              description: dao.ticker,
              ticker: dao.ticker,
              type: "crypto",
              session: "24x7",
              supported_resolutions: ["1", "5"] as ResolutionString[],
              minmov: 1,
              pricescale: 10000000000000,
              has_intraday: true,
              intraday_multipliers: ["1", "5"],
              visible_plots_set: "ohlcv",
              has_weekly_and_monthly: false,
              volume_precision: 2,
              data_status: "streaming",
              timezone: Intl.DateTimeFormat().resolvedOptions().timeZone as Timezone,
              exchange: "RepoFi"
            } as LibrarySymbolInfo)
          })
        },
        subscribeBars: (_symbolInfo, _resolution, _onBarsUpdateCallback, _guid, onResetCallback) => {
          setResetCallback(onResetCallback)
        },
        unsubscribeBars: () => {
          //
        },
        getBars: async (symbolInfo, resolution, periodParams, onHistoryCallback) => {
          const { to, countBack } = periodParams
          const result = await getAgentChartDataAction(
            dao.tokenId,
            Math.floor(to / 60) * 60, // Ensure time is a full minute (no seconds)
            countBack,
            resolution
          )
          setTimeout(() => {
            onHistoryCallback(result.data, { noData: result.noData })
          })
        }
      }
    }

    const tvWidget = new widget(widgetOptions)

    setChartWidget(tvWidget)

    return () => {
      tvWidget.remove()
    }
  }, [dao, setResetCallback, setChartWidget])

  return <div ref={chartContainerRef} className="h-full" />
}
