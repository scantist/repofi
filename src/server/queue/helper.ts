import {
  type Job,
  MetricsTime,
  Queue,
  type QueueOptions,
  Worker,
  type WorkerOptions
} from "bullmq"
import { connection } from "~/server/redis"

export const DEFAULT_QUEUE_CONFIG = {
  connection
}

export const DEFAULT_WORKER_CONFIG = {
  connection,
  removeOnComplete: { count: 10 },
  removeOnFail: { count: 40 },
  metrics: {
    maxDataPoints: MetricsTime.ONE_WEEK * 2
  }
}

export type WorkerFunction<JobInput, JobOutput, JobName extends string> = (
  job: Job<JobInput, JobOutput, JobName>,
  ctx: { logger: typeof console; queue: Queue<JobInput, JobOutput, JobName> },
) => Promise<JobOutput>;

const registeredQueues = new Map<string, ReturnType<typeof defineQueue>>()

export const defineQueue = <JobInput, JobOutput, JobName extends string>({
  queueName,
  concurrency,
  queueConfig = DEFAULT_QUEUE_CONFIG,
  workerConfig = DEFAULT_WORKER_CONFIG,
  workerFunction
}: {
  queueName: string;
  concurrency?: number;
  queueConfig?: QueueOptions;
  workerConfig?: WorkerOptions;
  workerFunction: WorkerFunction<JobInput, JobOutput, JobName>;
}) => {
  const loggerPrefix = `[Queue-${queueName.toUpperCase()}]`

  let queue: Queue<JobInput, JobOutput, JobName>
  let worker: Worker<JobInput, JobOutput, JobName>

  const getQueue = async () => {
    if (!queue) {
      await initQueue()
    }

    return queue
  }

  const initQueue = async () => {
    queue = new Queue<JobInput, JobOutput, JobName>(queueName, queueConfig)

    if (concurrency) {
      await queue.setGlobalConcurrency(concurrency)
    }

    worker = new Worker<JobInput, JobOutput, JobName>(
      queueName,
      async (job) => {
        const proxiedConsole = new Proxy(console, {
          get(target, prop: keyof Console) {
            if (typeof target[prop] === "function") {
              return (...args: unknown[]) => {
                const method = target[prop] as (...args: unknown[]) => void
                return method(`${loggerPrefix}`, ...args)
              }
            }
            return target[prop]
          }
        })
        return await workerFunction(job, { logger: proxiedConsole, queue })
      },
      workerConfig,
    )

    worker.on("completed", (job) => {
      console.log(
        `${loggerPrefix}[${job.id}] Processing of job ${job.name} completed`,
      )
    })

    worker.on("failed", (job, err) => {
      console.log(
        `${loggerPrefix}[${job?.id}] Processing of job ${job?.name ?? "n/a"} failed`,
        err,
      )
    })

    worker.on("error", (err) => {
      console.log(`${loggerPrefix} queue error occurred`, err)
    })

    console.log(`${loggerPrefix} queue initialized`)
  }

  const getMetrics = async (detailed = false) => {
    const queue = await getQueue()

    const result = {
      active: await queue.getActiveCount(),
      waiting: await queue.getWaitingCount(),
      workers: await queue.getWorkersCount(),
      jobs: await queue.getJobCounts()
    }

    return detailed
      ? {
          completed: await queue.getMetrics("completed"),
          failed: await queue.getMetrics("failed"),
          ...result
        }
      : result
  }

  const pauseQueue = async () => {
    const queue = await getQueue()

    await queue.pause()
    console.log(`${loggerPrefix} queue paused`)
  }

  const resumeQueue = async () => {
    const queue = await getQueue()

    await queue.resume()
    console.log(`${loggerPrefix} queue resumed`)
  }

  const queueOperations = {
    initQueue,
    getQueue,
    getMetrics,
    pauseQueue,
    resumeQueue
  }

  registeredQueues.set(queueName, queueOperations)

  return queueOperations
}

export const getQueueNames = () => {
  return Array.from(registeredQueues.keys())
}

export const getQueue = (queueName: string) => {
  return registeredQueues.get(queueName)
}
