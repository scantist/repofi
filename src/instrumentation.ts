import {initQueue as initContributorQueue} from "~/server/queue/contributor"
import {initQueue as initDEXQueue} from "~/server/queue/dex"
import {initQueue as initDaoQueue} from "~/server/queue/dao"

export async function register() {
  setTimeout(async () => {
    await Promise.all([initContributorQueue(), initDEXQueue(), initDaoQueue()]);
    console.log("Queues initialized successfully");
  }, 5000)


}
