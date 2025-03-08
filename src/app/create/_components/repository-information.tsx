import { AnimatePresence, motion } from "motion/react"
import React, { type FC } from "react"
import { type Repository } from "~/types/data"
import { Eye, GitFork, Star, X } from "lucide-react"
import { cn } from "~/lib/utils"
import { GlowingEffect } from "~/components/ui/glowing-effect"

type Props = {
  repo: Repository | boolean | null;
  id: string;
  onClose: () => void;
  ref: React.RefObject<HTMLDivElement | null>;
};

const RepositoryInformation: FC<Props> = ({ repo, id, onClose, ref }) => {
  return (
    <>
      <AnimatePresence>
        {repo && typeof repo === "object" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 h-full w-full bg-black/20"
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {repo && typeof repo === "object" ? (
          <div className="fixed inset-0 z-[100] grid place-items-center">
            <motion.button
              key={`button-${repo.name}-${id}`}
              layout
              initial={{
                opacity: 0
              }}
              animate={{
                opacity: 1
              }}
              exit={{
                opacity: 0,
                transition: {
                  duration: 0.05
                }
              }}
              className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white lg:hidden"
              onClick={onClose}
            >
              <X />
            </motion.button>
            <motion.div
              layoutId={`card-${repo.name}-${id}`}
              ref={ref}
              className={cn(
                "flex h-full w-full max-w-[700px] flex-col overflow-hidden rounded-lg bg-neutral-900 md:h-fit md:max-h-[90%]",
              )}
            >
              <div className="relative h-full rounded-2.5xl border  p-2  md:rounded-3xl md:p-3">
                <GlowingEffect
                  blur={0}
                  borderWidth={3}
                  spread={80}
                  glow={true}
                  disabled={false}
                  proximity={64}
                  inactiveZone={0.01}
                />
                <div className="relative flex h-full flex-col justify-between gap-6 overflow-hidden rounded-xl border-0.75 p-6  dark:shadow-[0px_0px_27px_0px_#2D2D2D] md:p-6">
                  <div className={"flex flex-row items-center justify-between"}>
                    <div className={"flex flex-row gap-x-4"}>
                      <motion.h3
                        layoutId={`title-${repo.name}-${id}`}
                        className="text-2xl font-bold"
                      >
                        {repo.name}
                      </motion.h3>
                    </div>
                    <div className={"flex flex-row items-center gap-x-4"}>
                      <motion.h3
                        layoutId={`title-star-${repo.name}-${id}`}
                        className={"flex flex-row items-center gap-x-2 text-sm"}
                      >
                        <Star className={"size-4"} />
                        {repo.star}
                      </motion.h3>
                      <motion.h3
                        layoutId={`title-fork-${repo.name}-${id}`}
                        className={"flex flex-row items-center gap-x-2 text-sm"}
                      >
                        <GitFork className={"size-4"} />
                        {repo.fork}
                      </motion.h3>
                      <motion.h3
                        layoutId={`title-watch-${repo.name}-${id}`}
                        className={"flex flex-row items-center gap-x-2 text-sm"}
                      >
                        <Eye className={"size-4"} />
                        {repo.watch}
                      </motion.h3>
                    </div>
                  </div>
                  <div className="mt-2">
                    <motion.p
                      layoutId={`description-${repo.description}-${id}`}
                      className="text-left text-neutral-400"
                    >
                      {repo.description}
                    </motion.p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </>
  )
}

export default RepositoryInformation
