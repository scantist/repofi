import { initQueue as initPOCQueue } from "~/server/queue/contributor"
import { initQueue as initDEXQueue } from "~/server/queue/dex"
await Promise.all([initPOCQueue(),initDEXQueue()])
