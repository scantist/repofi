import { bsc, sepolia } from "@reown/appkit/networks"
import Decimal from "decimal.js"
import { createPublicClient, http } from "viem"
import { env } from "~/env"

const W_COIN_ADDRESSES: Record<number, `0x${string}`> = {
  [bsc.id]: "0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c", // BSC Mainnet WBNB
  [sepolia.id]: "0xfff9976782d46cc05630d1f6ebab18b2324d6b14" // Sepolia WETH
} as const
export const isMainNet = env.NEXT_PUBLIC_CHAIN_ID === bsc.id
export const defaultChain = isMainNet ? bsc : sepolia
export const defaultWCoinAddress = W_COIN_ADDRESSES[defaultChain.id]

export const getPublicClient = () => {
  return createPublicClient({
    chain: defaultChain,
    transport: env.CHAIN_RPC_URL?.[defaultChain.id] ? http(env.CHAIN_RPC_URL[defaultChain.id]) : http()
  })
}

export const shortenAddress = (address: string, size = 4) => {
  return `${address.substring(0, size + 2)}...${address.substring(address.length - size, address.length)}`
}

/**
 * Convert a token amount to a human readable amount by dividing by 10^decimals
 * @param value - The token amount to convert
 * @param decimalPlaces - The number of decimal places to round to (default: 2)
 * @returns The human readable amount
 */
export function toHumanAmount(value: string | bigint, decimal: number, decimalPlaces = 2) {
  const _value = value.toString()
  console.log("toHumanAmount", value, new Decimal(_value).div(new Decimal(10).pow(decimal)).toFixed(decimalPlaces, Decimal.ROUND_DOWN))
  return new Decimal(_value).div(new Decimal(10).pow(decimal)).toFixed(decimalPlaces, Decimal.ROUND_DOWN)
}

/**
 * Convert a human readable amount to a token amount by multiplying by 10^decimals
 * @param value - The human readable amount to convert
 * @returns The token amount
 */
export function fromHumanAmount(value: string | number, decimal: number) {
  Decimal.set({ toExpPos: 36 })
  return new Decimal(value).mul(new Decimal(10).pow(decimal))
}

export function parseAddressFromTopic(topic: string) {
  return `0x${topic.slice(26)}`
}
