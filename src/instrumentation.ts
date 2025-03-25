import { initQueue as initPOCQueue } from "~/server/queue/contributor"
import { initQueue as initDEXQueue } from "~/server/queue/dex"

export async function register() {
  await Promise.all([initPOCQueue(), initDEXQueue()]);
  console.log("Queues initialized successfully");
}
