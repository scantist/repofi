import {defineQueue, type WorkerFunction} from "./helper"
import {fetchAllRepoContributors, parseRepoUrl} from "~/server/tool/repo"
import {calculateContributorsPercentage} from "~/server/tool/proof"
import {db} from "~/server/db"
import {CommonError, ErrorCode} from "~/lib/error"
import {Prisma} from "@prisma/client";

const queueName = "contributor"

type JobName = "contributor-init" | "contributor-update" | "contributor-update-wallet"

type JobInput = {
  daoId: string
  url: string
}

type JobOutput = undefined

const updateContributorWallet = async (logger: typeof console) => {
  try {
    const query = Prisma.sql`
        UPDATE t_contributor tc
        SET user_address = tup.user_address
        FROM t_user_platform tup
        WHERE tc.user_platform = tup.platform
          AND tc.user_platform_id = tup.platform_id
    `

    const result = await db.$executeRaw(query)

    logger.info(`Successfully updated contributor wallets. Rows affected: ${result}`)
  } catch (error) {
    logger.error("Failed to update contributor wallets:", error)
    throw new CommonError(ErrorCode.INTERNAL_ERROR, "Failed to update contributor wallets", error)
  }
}

const workerFunction: WorkerFunction<JobInput, JobOutput, JobName> = async (job, {logger}) => {
  switch (job.name) {
    case "contributor-init":
      try {
        const repoMeta = parseRepoUrl(job.data.url)
        const contributors = await fetchAllRepoContributors(repoMeta.platform, repoMeta.owner, repoMeta.repo)
        const contributorsPercentage = calculateContributorsPercentage(contributors)
        await db.$transaction(async (tx) => {
          for (const contributorPercentage of contributorsPercentage) {
            const contributor = await tx.contributor.create({
              data: {
                daoId: job.data.daoId,
                userPlatform: repoMeta.platform,
                userPlatformId: contributorPercentage.id,
                userPlatformName: contributorPercentage.name,
                userPlatformAvatar: contributorPercentage.avatar,
                snapshotValue: contributorPercentage.value
              }
            })
            await tx.contributorHistory.create({
              data: {
                tag: "INITIAL",
                value: contributorPercentage.value,
                contributorId: contributor.id
              }
            })
          }
        })
        logger.info(`Successfully initialized contributors for DAO ${job.data.daoId}`)
      } catch (error) {
        logger.error(`Failed to initialize contributors for DAO ${job.data.daoId}: ${error instanceof Error ? error.message : String(error)}`)
        throw new CommonError(ErrorCode.INTERNAL_ERROR, "Failed to initialize contributors" as string, error)
      }
      break
    case "contributor-update":
      break
    case "contributor-update-wallet":
      await updateContributorWallet(logger)
      break

  }
}

const {
  getQueue,
  getMetrics,
  initQueue: _initQueue,
  pauseQueue,
  resumeQueue
} = defineQueue<JobInput, JobOutput, JobName>({
  queueName,
  workerFunction
})

const initQueue = async () => {
  await _initQueue()
  const queue = await getQueue()
  await queue.upsertJobScheduler("contributor-update-wallet", {
    every: 600 * 1000 // 10 minutes
  })
  console.log("[Queue-Contributor] Upstarted contributor scheduler")
}

export {getQueue, getMetrics, initQueue, pauseQueue, resumeQueue}


export const emitContributorInit = async (daoId: string, url: string) => {
  const queue = await getQueue()
  await queue.add("contributor-init", {daoId, url})
}
