import Decimal from "decimal.js";
import { erc20Abi, ethAddress } from "viem";
import { readContract } from "viem/actions";
import { bsc, sepolia } from "viem/chains";
import { z } from "zod";
import Pool from "~/lib/abi/UniswapV3Pool.json";
import { defaultChain, defaultWCoinAddress, getPublicClient } from "~/lib/web3";


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

    // 使用 Decimal 计算价格
    const sqrtPrice = new Decimal(sqrtPriceX96.toString());
    const Q96 = new Decimal(2).pow(96);
    const price = sqrtPrice.div(Q96).pow(2)
      .mul(Decimal.pow(10, token0Decimals))
      .div(Decimal.pow(10, token1Decimals));

    // 确保我们返回的是指定 tokenAddress 的价格
    const isTokenAddressToken0 = tokenAddress.toLowerCase() === token0.toLowerCase();
    const finalPrice = isTokenAddressToken0 ? price : new Decimal(1).div(price);

    return {
      rawPrice: finalPrice,
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

function parseChainId(chain = defaultChain) {
  switch (chain) {
    case bsc:
      return "bsc";
    case sepolia:
      return "sepolia";
    default:
      return "bsc";
  }
}

export async function fetchTokenPriceUsd(tokenAddress: string) {
  const chainId = parseChainId(defaultChain)
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
      `https://api.dexscreener.com/tokens/v1/${chainId}/${realTokenAddress}`,
      {
        signal: controller.signal,
        next: { revalidate: 60 }
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


export async function fetchPairPriceUsd(pairAddress: string) {
  const chainId = parseChainId(defaultChain)
  const controller = new AbortController()
  const timeoutId = setTimeout(() => {
    console.log(`[Tool|Dex|Pair|Price] Timeout fetching price for ${pairAddress}`)
    controller.abort()
  }, 10000)
  try {
    const response = await fetch(`https://api.dexscreener.com/latest/dex/pairs/${chainId}/${pairAddress}`, {
      signal: controller.signal,
      next: { revalidate: 60 }
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
