import { initQueue as initPOCQueue } from "~/server/queue/contributor"


await Promise.all([
    initPOCQueue()
])