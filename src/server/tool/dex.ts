import {defaultChain, defaultWCoinAddress, getPublicClient} from "~/lib/web3"
import {z} from "zod"
import Pool from "~/lib/abi/UniswapV3Pool.json";
import {readContract} from "viem/actions";
import {erc20Abi, ethAddress} from "viem";


const tokenPriceSchema = z.array(
  z.object({
    chainId: z.string(),
    priceNative: z.string().transform(Number),
    priceUsd: z.string().transform(Number),
    priceChange: z.object({
      h1: z.number().optional(),
      h6: z.number().optional(),
      h24: z.number().optional()
    }),
    marketCap: z.number()
  }))

const pairPriceSchema = z.object({
  pairs: z.array(
    z.object({
      chainId: z.string(),
      priceNative: z.string().transform(Number),
      priceUsd: z.string().transform(Number),
      priceChange: z.object({
        h1: z.number().optional(),
        h6: z.number().optional(),
        h24: z.number().optional()
      }),
      marketCap: z.number()
    }),
  )
})

import { formatUnits } from "viem";

export async function fetchTokenSpotPrice(
  pairAddress: `0x${string}`,
  tokenAddress: `0x${string}`
) {
  const publicClient = getPublicClient();

  try {
    // 获取池子当前状态
    const slot0Data = await readContract(publicClient, {
      abi: Pool,
      address: pairAddress,
      functionName: "slot0"
    }) as [bigint, number, number, number, number, number, boolean];

    // 获取 token0 和 token1
    const token0 = await readContract(publicClient, {
      abi: Pool,
      address: pairAddress,
      functionName: "token0"
    }) as `0x${string}`;

    const token1 = await readContract(publicClient, {
      abi: Pool,
      address: pairAddress,
      functionName: "token1"
    }) as `0x${string}`;

    // 获取 token0 和 token1 的小数位数
    const getDecimals = async (address: `0x${string}`) => {
      try {
        return await readContract(publicClient, {
          abi: erc20Abi,
          address,
          functionName: "decimals"
        }) as number;
      } catch (error) {
        console.error(`Error getting decimals for ${address}:`, error);
        return null;
      }
    };

    const token0Decimals = await getDecimals(token0);
    const token1Decimals = await getDecimals(token1);

    if (token0Decimals === null || token1Decimals === null) {
      throw new Error(`Unable to get decimals for tokens: ${token0}, ${token1}`);
    }

    const [sqrtPriceX96] = slot0Data;

    if (sqrtPriceX96 === 0n) {
      return null;
    }

    // 计算原始价格 = (sqrtPriceX96 / 2^96)^2
    const Q96 = 2n ** 96n;
    const price = (sqrtPriceX96 * sqrtPriceX96 * 10n ** BigInt(token0Decimals)) / (Q96 * Q96 * 10n ** BigInt(token1Decimals));

    console.log(`Raw price: ${price}`);

    // 确保我们返回的是指定 tokenAddress 的价格
    const isTokenAddressToken0 = tokenAddress.toLowerCase() === token0.toLowerCase();
    const finalPrice = isTokenAddressToken0 ? price : (10n ** 36n) / price;

    console.log(`Final raw price: ${finalPrice}`);

    // 转换为更易读的格式
    const readablePrice = formatUnits(finalPrice, 18);

    return {
      rawPrice: finalPrice,
      readablePrice,
      token0,
      token1,
      token0Decimals,
      token1Decimals
    };
  } catch (error) {
    console.error("Error calculating price:", error);
    return null;
  }
}

export async function fetchTokenPriceUsd(tokenAddress: string, chain = defaultChain.name.toLowerCase()) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    console.log(`[Tool|Dex|Token|Price] Timeout fetching price for ${tokenAddress}`)
    controller.abort()
  }, 10000)
  try {
    let realTokenAddress = tokenAddress
    if (realTokenAddress === ethAddress) {
      realTokenAddress = defaultWCoinAddress as string
    }
    const response = await fetch(
      `https://api.dexscreener.com/tokens/v1/${chain}/${realTokenAddress}`,
      {
        signal: controller.signal,
        next: {revalidate: 60}
      },
    )
    clearTimeout(timeoutId)
    const data = tokenPriceSchema.parse(await response.json())
    const price = data[0]?.priceUsd ?? 0
    if (!price) {
      console.warn(`[Tool|Dex|Price] Invalid price found for ${tokenAddress}`)
    }
    return price
  } catch (e) {
    clearTimeout(timeoutId)
    console.error(`[Tool|Dex|Price] Error fetching price for ${tokenAddress}`, e)
    return 0
  }
}


export async function fetchPairPriceUsd(pairAddress: string, chain = defaultChain.name.toLowerCase()) {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    console.log(`[Tool|Dex|Pair|Price] Timeout fetching price for ${pairAddress}`)
    controller.abort()
  }, 10000)
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/${chain}/${pairAddress}`, {
      signal: controller.signal,
      next: {revalidate: 60}
    })
    clearTimeout(timeoutId)
    const data = pairPriceSchema.parse(await response.json())
    const price = data.pairs[0]?.priceUsd ?? 0
    if (!price) {
      console.warn(`[Tool|Dex|Pair|Price] Invalid price found for ${pairAddress}`)
    }
    return price
  } catch (e) {
    clearTimeout(timeoutId)
    console.error(`[Tool|Dex|Pair|Price] Error fetching price for ${pairAddress}`, e)
    return 0
  }
}
