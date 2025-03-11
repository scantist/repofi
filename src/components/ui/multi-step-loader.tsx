"use client"
import { cn } from "~/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { CircleCheck, CircleCheckBig, CircleX } from "lucide-react"
import { Button } from "~/components/ui/button"

export type LoadingState = {
  text: string;
};

const LoaderCore = ({
  loadingStates,
  errorState = -1,
  value = 0
}: {
  loadingStates: LoadingState[];
  value?: number;
  errorState?: number;
}) => {
  return (
    <div className="relative mx-auto mt-40 flex max-w-xl flex-col justify-start">
      {loadingStates.map((loadingState, index) => {
        const distance = Math.abs(index - value)
        const opacity = Math.max(1 - distance * 0.2, 0)
        const currentError = value === index && value == errorState
        return (
          <motion.div
            key={index}
            className={cn(
              "mb-4 flex gap-2 text-left text-sm md:text-lg lg:text-xl",
            )}
            initial={{ opacity: 0, y: -(value * 40) }}
            animate={{ opacity: opacity, y: -(value * 40) }}
            transition={{ duration: 0.5 }}
          >
            <div>
              {index > value && (
                <CircleCheck className="text-black dark:text-white" />
              )}
              {index <= value &&
                (currentError ? (
                  <CircleX className={"text-destructive"} />
                ) : (
                  <CircleCheck
                    className={cn(
                      "text-black dark:text-white",
                      value === index &&
                        "text-black opacity-100 dark:text-lime-500",
                    )}
                  />
                ))}
            </div>
            <span
              className={cn(
                "text-black dark:text-white",
                value === index && "text-black opacity-100 dark:text-lime-500",
                currentError && "dark:text-destructive",
              )}
            >
              {loadingState.text}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}

export const MultiStepLoader = ({
  loadingStates,
  currentState,
  errorState = -1,
  loading,
  onClose
}: {
  loadingStates: LoadingState[];
  currentState: number;
  errorState?: number;
  loading?: boolean;
  onClose?: () => void;
}) => {
  return (
    <AnimatePresence mode="wait">
      {loading && (
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
          className="fixed inset-0 z-[100] flex flex-col h-full w-full items-center justify-center backdrop-blur-2xl"
        >
          <div className="relative h-96 z-[120]">
            <LoaderCore
              value={currentState}
              loadingStates={loadingStates}
              errorState={errorState}
            />

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
          </div>

          <div className="absolute inset-x-0 bottom-0 z-20 h-full bg-white bg-gradient-to-t [mask-image:radial-gradient(900px_at_center,transparent_30%,white)] dark:bg-black" />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
