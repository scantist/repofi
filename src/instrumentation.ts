import {initQueue as initContributorQueue} from "~/server/queue/contributor"
import {initQueue as initDEXQueue} from "~/server/queue/dex"

export async function register() {
  setTimeout(async ()=>{
    await Promise.all([initContributorQueue(), initDEXQueue()]);
    console.log("Queues initialized successfully");
  },5000)


}
