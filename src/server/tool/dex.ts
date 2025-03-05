import { dexPriceSchema } from "~/lib/schema"
export async function fetchUsdPrice(pairAddress: string, chain = "base") {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    console.log(`[Tool|Dex|Price] Timeout fetching price for ${pairAddress}`)
    controller.abort()
  }, 10000)
  try {
    const response = await fetch(
      `https://api.dexscreener.com/latest/dex/pairs/${chain}/${pairAddress}`,
      {
        signal: controller.signal,
        next: { revalidate: 60 }
      },
    )
    clearTimeout(timeoutId)
    const data = dexPriceSchema.parse(await response.json())
    const price = data.pairs[0]?.priceUsd ?? 0
    if (!price) {
      console.warn(`[Tool|Dex|Price] Invalid price found for ${pairAddress}`)
    }
    return price
  } catch (e) {
    clearTimeout(timeoutId)
    console.error(`[Tool|Dex|Price] Error fetching price for ${pairAddress}`, e)
    return 0
  }
}
