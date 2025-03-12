import { defineQueue, type WorkerFunction } from "./helper"
import { fetchRepoContributors, parseRepoUrl } from "~/server/tool/repo"
import { calculateContributorsPercentage } from "~/server/tool/proof"
import { db } from "~/server/db"
import { CommonError, ErrorCode } from "~/lib/error"

const queueName = "contributor"

type JobName = "contributor-init" | "contributor-update";

type JobInput = {
  daoId: string;
  url: string;
};

type JobOutput = void;

const workerFunction: WorkerFunction<JobInput, JobOutput, JobName> = async (
  job,
  { logger },
) => {
  switch (job.name) {
    case "contributor-init":
      try {
        const repoMeta = parseRepoUrl(job.data.url)
        const contributors = await fetchRepoContributors(
          repoMeta.platform,
          repoMeta.owner,
          repoMeta.repo,
        )
        const contributorsPercentage =
          calculateContributorsPercentage(contributors)
        await db.$transaction(async (tx) => {
          for (const contributorPercentage of contributorsPercentage) {
            const contributor = await tx.contributor.create({
              data: {
                daoId: job.data.daoId,
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
        logger.info(
          `Successfully initialized contributors for DAO ${job.data.daoId}`,
        )
      } catch (error) {
        logger.error(
          `Failed to initialize contributors for DAO ${job.data.daoId}: ${error instanceof Error ? error.message : String(error)}`,
        )
        throw new CommonError(
          ErrorCode.INTERNAL_ERROR,
          "Failed to initialize contributors" as string,
          error,
        )
      }
      break
    case "contributor-update":
  }
}

const { getQueue, getMetrics, initQueue, pauseQueue, resumeQueue } =
  defineQueue<JobInput, JobOutput, JobName>({
    queueName,
    workerFunction
  })

export { getQueue, getMetrics, initQueue, pauseQueue, resumeQueue }

export const emitContributorInit = async (daoId: string, url: string) => {
  const queue = await getQueue()
  await queue.add("contributor-init", { daoId, url })
}
