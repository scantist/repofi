"use client"
import { cn } from "~/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { CircleCheck, CircleX, LoaderCircle } from "lucide-react"
import { Button } from "~/components/ui/button"

export type visibleState = {
  text: string
}

const LoaderCore = ({
  visible,
  description,
  errorState = -1,
  progressState = -1,
  value = 0
}: {
  visible: visibleState[]
  value?: number
  description?: string | boolean
  errorState?: number
  progressState?: number
}) => {
  return (
    <div className="relative mx-auto mt-40 flex max-w-xl flex-col justify-start">
      {visible.map((loadingState, index) => {
        const distance = Math.abs(index - value)
        const opacity = Math.max(1 - distance * 0.2, 0)
        const currentError = value === index && value == errorState
        const currentProgress = value === index && value == progressState
        return (
          <motion.div
            key={index}
            className={cn("mb-4 flex gap-2 items-center text-left text-sm md:text-lg lg:text-xl")}
            initial={{ opacity: 0, y: -(value * 40) }}
            animate={{ opacity: opacity, y: -(value * 40) }}
            transition={{ duration: 0.5 }}
          >
            <div>
              {index > value && <CircleCheck className="text-white" />}
              {index <= value && !currentProgress && !currentError && <CircleCheck className={"text-lime-500"} />}
              {currentError ? <CircleX className={"text-destructive"} /> : currentProgress && <LoaderCircle className={"animate-spin"} />}
            </div>
            <div className={cn(
              "text-white flex flex-col", 
              index <= value && "text-lime-500 opacity-100",
              currentProgress && "text-white",
              currentError && "text-destructive"
            )}>
              <div>{loadingState.text}</div>
              {description && (currentProgress || currentError) && value === index && (
                <div className="text-xs md:text-sm font-thin">
                  {description}
                </div>
              )}
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}

export const MultiStepLoader = ({
  loadingStates,
  currentState,
  description,
  errorState = -1,
  progressState = -1,
  visible,
  onClose,
  onFinish
}: {
  loadingStates: visibleState[]
  currentState: number
  description?: string | boolean
  errorState?: number
  progressState?: number
  visible?: boolean
  onClose?: () => void
  onFinish?: () => void
}) => {
  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          className="fixed inset-0 z-[100] flex h-full w-full flex-col items-center justify-center backdrop-blur-2xl"
        >
          <div className="relative z-[120] h-96">
            <LoaderCore value={currentState} visible={loadingStates} errorState={errorState} progressState={progressState} description={description} />

            {errorState >= 0 && (
              <Button
                onClick={() => {
                  onClose?.()
                }}
                className={"mt-8 w-20 cursor-pointer"}
              >
                Close
              </Button>
            )}
            {currentState === loadingStates.length - 1 && progressState < 0 && errorState < 0 && (
              <Button
                onClick={() => {
                  onFinish?.()
                }}
                className={"mt-8 w-20 cursor-pointer"}
              >
                Finish
              </Button>
            )}
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 h-full bg-white bg-gradient-to-t [mask-image:radial-gradient(900px_at_center,transparent_30%,white)] dark:bg-black" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
