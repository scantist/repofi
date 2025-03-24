"use client"

import dynamic from "next/dynamic"
import Script from "next/script"
import { useState } from "react"

const TVChartContainer = dynamic(() => import("~/components/trade-view/charts").then((mod) => mod.TVChartContainer), { ssr: false })

export default function TradeView({
  dao
}: {
  dao: {
    tokenId: bigint
    name: string
    ticker: string
  }
}) {
  const [isScriptReady, setIsScriptReady] = useState(false)
  return (
    <>
      <Script
        src="/static/datafeeds/udf/dist/bundle.js"
        strategy="lazyOnload"
        onReady={() => {
          setIsScriptReady(true)
        }}
      />
      {isScriptReady && <TVChartContainer dao={dao} />}
    </>
  )
}
