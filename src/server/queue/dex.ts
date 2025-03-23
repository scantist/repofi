import {defineQueue, type WorkerFunction} from "./helper"
import {db} from "~/server/db"
import {CommonError, ErrorCode} from "~/lib/error"
import {fetchTokenPriceUsd, fetchTokenSpotPrice} from "~/server/tool/dex"
import {Prisma, PrismaPromise} from "@prisma/client"

const queueName = "dex"

type JobName = "dex-sync-asset-price" | "dex-sync-launching-dao-metrics" | "dex-sync-graduated-dao-metrics";

type JobInput = {
  daoId: string;
  url: string;
};

type JobOutput = undefined;

const syncAssetPrice = async (logger: typeof console) => {
  try {
    const assets = await db.assetToken.findMany({
      where: {
        isAllowed: true
      }
    })
    const updates = assets.map(async (asset) => {
      const usdPrice = await fetchTokenPriceUsd(asset.address)
      return db.assetToken.update({
        where: {address: asset.address},
        data: {priceUsd: usdPrice}
      })
    })
    await Promise.all(updates)
    logger.info("Successfully synced prices for all allowed assets")
  } catch (error) {
    logger.error("Failed to sync prices:", error)
    throw new CommonError(
      ErrorCode.INTERNAL_ERROR,
      "Failed to sync asset prices",
      error,
    )
  }
}

const syncLaunchingDaoMetrics = async (logger: typeof console) => {
  try {
    const launchingDaoTokens = await db.daoTokenInfo.findMany({
      where: {
        isGraduated: false
      },
      include: {
        dao: true,
        assetToken: true
      }
    });

    const updates = launchingDaoTokens.map(async (tokenInfo) => {
      if (tokenInfo.dao && tokenInfo.assetToken) {
        const priceUsd = Number(tokenInfo.price ?? 0) * Number(tokenInfo.assetToken.priceUsd ?? 0);
        const marketCapUsd = Number(tokenInfo.marketCap ?? 0) * Number(tokenInfo.assetToken.priceUsd ?? 0);
        return db.dao.update({
          where: {id: tokenInfo.dao.id},
          data: {
            priceUsd: priceUsd,
            marketCapUsd: marketCapUsd
          }
        });
      }
    }).filter((update) => update !== undefined);
    await Promise.all(updates);
    logger.info(`Successfully synced prices and market caps for ${updates.length} launching DAOs`);
  } catch (error) {
    logger.error("Failed to sync launching DAO prices and market caps:", error);
    throw new CommonError(
      ErrorCode.INTERNAL_ERROR,
      "Failed to sync launching DAO prices and market caps",
      error,
    );
  }
};

const syncGraduatedDaoMetrics = async (logger: typeof console) => {
  try {
    const graduatedDaoTokens = await db.daoTokenInfo.findMany({
      where: {
        isGraduated: true
      },
      include: {
        dao: true,
        assetToken: true
      }
    });

    const updates = graduatedDaoTokens.map(async (tokenInfo) => {
      if (tokenInfo.dao && tokenInfo.assetToken && tokenInfo.uniswapV3Pair && tokenInfo.tokenAddress) {
        const result = await fetchTokenSpotPrice(tokenInfo.uniswapV3Pair! as `0x${string}`, tokenInfo.tokenAddress! as `0x${string}`);
        if (result) {
          const {rawPrice} = result;
          const priceUsd = Number(rawPrice) * Number(tokenInfo.assetToken.priceUsd ?? 0);
          const marketCapUsd = Number(tokenInfo.totalSupply) * priceUsd;
          return db.dao.update({
            where: {id: tokenInfo.dao.id},
            data: {
              priceUsd: priceUsd,
              marketCapUsd: marketCapUsd
            }
          });
        }
      }
    }).filter((update) => update !== undefined);
    await Promise.all(updates);
    logger.info(`Successfully synced prices and market caps for ${updates.length} graduated DAOs`);
  } catch (error) {
    logger.error("Failed to sync graduated DAO prices and market caps:", error);
    throw new CommonError(
      ErrorCode.INTERNAL_ERROR,
      "Failed to sync graduated DAO prices and market caps",
      error,
    );
  }
}

const workerFunction: WorkerFunction<JobInput, JobOutput, JobName> = async (
  job,
  {logger},
) => {
  switch (job.name) {
    case "dex-sync-asset-price":
      await syncAssetPrice(logger)
      break
    case "dex-sync-launching-dao-metrics":
      await syncLaunchingDaoMetrics(logger)
      break
    case "dex-sync-graduated-dao-metrics":
      await syncGraduatedDaoMetrics(logger)
      break
    default:
  }
}

const {getQueue, getMetrics, initQueue: _initQueue, pauseQueue, resumeQueue} =
  defineQueue<JobInput, JobOutput, JobName>({
    queueName,
    workerFunction
  })
const initQueue = async () => {
  await _initQueue();
  const queue = await getQueue();
  await queue.upsertJobScheduler("dex-sync-asset-price", {
    every: 300 * 1000, // 5 minutes
  });

  await queue.upsertJobScheduler("dex-sync-launching-dao-metrics", {
    every: 300 * 1000, // 5 minutes
  });
  await queue.upsertJobScheduler("dex-sync-graduated-dao-metrics", {
    every: 300 * 1000, // 5 minutes
  });
  console.log("[Queue-PRICE] Upserted dex scheduler");
};
export {getQueue, getMetrics, initQueue, pauseQueue, resumeQueue}
