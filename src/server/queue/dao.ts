import {defineQueue, type WorkerFunction} from "./helper"
import {db} from "~/server/db"
import {CommonError, ErrorCode} from "~/lib/error"
import {Prisma} from "@prisma/client"

const queueName = "dao"

type JobName = "dao-update-token-unlock-ratio" | "dao-update-graduated-holders";

type JobInput = {
  daoId: string;
  url: string;
};

type JobOutput = undefined;

const updateTokenUnlockRatio = async (logger: typeof console) => {
  try {
    const tokenInfoList = await db.daoTokenInfo.findMany({
      where: {
        unlockRatio: null,
        tokenAddress: {
          not: null
        }
      }
    });
    const updates = tokenInfoList.map(async (tokenInfo) => {

      const evtTokenLockLog = await db.evtTokenLockLog.findFirst({
        where: {
          tokenAddress: tokenInfo.tokenAddress!,
        }
      });
      if (evtTokenLockLog && evtTokenLockLog.unlockRatio !== null) {
        return db.daoTokenInfo.update({
          where: {
            tokenId: tokenInfo.tokenId
          },
          data: {
            unlockRatio: Number(evtTokenLockLog.unlockRatio) / 10000
          }
        })
      }
      return undefined
    }).filter((update) => update !== undefined);
    await Promise.all(updates)
    logger.info("Successfully updated unlock ratios for dao token info")
  } catch (error) {
    logger.error("Failed to update unlock ratios:", error)
    throw new CommonError(
      ErrorCode.INTERNAL_ERROR,
      "Failed to update unlock ratios",
      error,
    )
  }
}


const updateTokenGraduatedHolders = async (logger: typeof console) => {
  try {
    const query = Prisma.sql`
        WITH holder_counts AS (SELECT token_id, COUNT(DISTINCT user_address) AS holder_count
                               FROM (
                                        -- Launch holders
                                        SELECT tdlh.token_id,
                                               tdlh.user_address,
                                               (tdlh.balance * (1 - tdti.unlock_ratio) -
                                                COALESCE(tuch.total_claim_amount, 0)) AS balance
                                        FROM t_dao_token_info tdti
                                                 INNER JOIN t_dao_launch_holder tdlh ON tdti.token_id = tdlh.token_id
                                                 LEFT JOIN (SELECT user_address,
                                                                   token_address,
                                                                   SUM(claim_amount) AS total_claim_amount
                                                            FROM t_user_claim_history
                                                            GROUP BY user_address, token_address) tuch
                                                           ON tdlh.user_address = tuch.user_address AND
                                                              tdti.token_address = tuch.token_address
                                        WHERE tdti.is_graduated = true
                                          AND tdlh.balance > 0
                                          AND tdti.unlock_ratio IS NOT NULL
                                        UNION ALL
                                        -- Graduation holders
                                        SELECT tdgh.token_id, tdgh.user_address, tdgh.balance
                                        FROM t_dao_graduation_holder tdgh
                                                 INNER JOIN t_dao_token_info tdti ON tdgh.token_id = tdti.token_id
                                        WHERE tdti.is_graduated = true
                                          and tdti.unlock_ratio is not null) combined_holders
                               WHERE balance > 0
                               GROUP BY token_id)
        UPDATE t_dao_token_info
        SET holder_count = hc.holder_count FROM holder_counts hc
        WHERE t_dao_token_info.token_id = hc.token_id
    `;

    const result = await db.$executeRaw(query);

    logger.info(`Successfully updated holder counts for graduated DAOs. Rows affected: ${result}`);
  } catch (error) {
    logger.error("Failed to update holder counts for graduated DAOs:", error);
    throw new CommonError(
      ErrorCode.INTERNAL_ERROR,
      "Failed to update holder counts for graduated DAOs",
      error,
    );
  }
};

const workerFunction: WorkerFunction<JobInput, JobOutput, JobName> = async (
  job,
  {logger},
) => {
  switch (job.name) {
    case "dao-update-token-unlock-ratio":
      await updateTokenUnlockRatio(logger)
      break
    case "dao-update-graduated-holders":
      await updateTokenGraduatedHolders(logger)
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
  await queue.upsertJobScheduler("dao-update-token-unlock-ratio", {
    every: 600 * 1000, // 10 minutes
  });
  await queue.upsertJobScheduler("dao-update-graduated-holders", {
    every: 600 * 1000, // 10 minutes
  });
  console.log("[Queue-PRICE] Upserted dao scheduler");
};
export {getQueue, getMetrics, initQueue, pauseQueue, resumeQueue}
