"use client"

import React, { useEffect, useId, useRef, useState } from "react"
import CardWrapper from "~/components/card-wrapper"
import { SiGithub } from "@icons-pack/react-simple-icons"
import { Eye, GitFork, LogOut, Star } from "lucide-react"
import { useOutsideClick } from "~/hooks/use-outside-click"
import { AnimatePresence, motion } from "motion/react"
import { type Repository } from "~/types/data"
import RepositoryInformation from "~/app/create/_components/repository-information"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import AvatarGroupMax from "~/components/ui/avatar-group-max"
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"

const repositoryList: Repository[] = [
  {
    name: "vue",
    description:
      "Vue.js is a progressive, incrementally-adoptable JavaScript framework for building UI on the web.",
    link: "https://github.com/vuejs/vue",
    star: 200231,
    fork: 33245,
    watch: 6521
  },
  {
    name: "react",
    description:
      "A declarative, efficient, and flexible JavaScript library for building user interfaces.",
    link: "https://github.com/facebook/react",
    star: 186542,
    fork: 38901,
    watch: 6789
  },
  {
    name: "typescript",
    description:
      "TypeScript is a superset of JavaScript that compiles to clean JavaScript output.",
    link: "https://github.com/microsoft/typescript",
    star: 82345,
    fork: 11234,
    watch: 2156
  },
  {
    name: "vite",
    description: "Next generation frontend tooling. It's fast!",
    link: "https://github.com/vitejs/vite",
    star: 45678,
    fork: 4567,
    watch: 890
  },
  {
    name: "angular",
    description: "One framework. Mobile & desktop.",
    link: "https://github.com/angular/angular",
    star: 78901,
    fork: 20789,
    watch: 3421
  },
  {
    name: "svelte",
    description: "Cybernetically enhanced web apps",
    link: "https://github.com/sveltejs/svelte",
    star: 64532,
    fork: 3245,
    watch: 1234
  },
  {
    name: "next.js",
    description: "The React Framework for Production",
    link: "https://github.com/vercel/next.js",
    star: 89234,
    fork: 18765,
    watch: 2345
  },
  {
    name: "nuxt",
    description: "The Intuitive Vue Framework",
    link: "https://github.com/nuxt/nuxt",
    star: 42156,
    fork: 3678,
    watch: 890
  }
]

const BindRepository = () => {
  const [active, setActive] = useState<Repository | boolean | null>(null)
  const [current, setCurrent] = useState<Repository | boolean | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const id = useId()

  useOutsideClick(ref as React.RefObject<HTMLDivElement>, () =>
    setActive(null),
  )

  return (
    <CardWrapper className={"col-span-1 flex w-full flex-col md:col-span-2"}>
      <div
        className={
          "bg-card flex flex-col items-center justify-center gap-4 py-8"
        }
      >
        <div
          className={"flex w-full flex-row items-center justify-between px-14"}
        >
          <div className={"flex flex-row gap-x-3"}>
            <SiGithub />
            <div>lizhongyue248@163.com</div>
          </div>
          <LogOut />
        </div>
        <RepositoryInformation
          id={id}
          repo={active}
          ref={ref}
          onClose={() => setActive(null)}
        />
        <div className={"flex flex-col gap-4"}>
          {repositoryList.map((repo, index) => (
            <motion.div
              layoutId={`card-${repo.name}-${id}`}
              key={`card-${repo.name}-${id}`}
              className={cn(
                "mx-10 my-2 flex flex-col gap-4 border-b border-b-neutral-400 px-4 py-2 pb-4 transition"
              )}
            >
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
              <div className={"flex flex-row justify-between items-center"}>
                <motion.p className={"font-thin cursor-pointer"} onClick={() => setActive(repo)}>
                  Detail
                </motion.p>
                <div className={"flex flex-row gap-4"}>
                  <AvatarGroupMax className="flex items-center " max={5} avatarClassName={"h-6 w-6 text-xs"}>
                    <Avatar className="-ml-2 cursor-pointer first:ml-">
                      <AvatarImage
                        src="https://github.com/shadcn.png"
                        alt="@shadcn"
                      />
                      <AvatarFallback className="bg-indigo-500 text-white">
                        CN
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="-ml-2 cursor-pointer first:ml-0">
                      <AvatarFallback className="bg-green-600 text-white">
                        CN
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="-ml-2 cursor-pointer first:ml-0">
                      <AvatarFallback className="bg-red-500 text-white">
                        AB
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="-ml-2 cursor-pointer first:ml-0">
                      <AvatarFallback className="bg-indigo-500 text-white">
                        VK
                      </AvatarFallback>
                    </Avatar>
                    <Avatar className="-ml-2 cursor-pointer first:ml-0">
                      <AvatarFallback className="bg-orange-500 text-white">
                        RS
                      </AvatarFallback>
                    </Avatar>
                  </AvatarGroupMax>
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={current === repo ? "unbind" : "bind"}
                      layout
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "auto", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      onClick={() => setCurrent(repo)}
                      className={cn(
                        "font-bold cursor-pointer overflow-hidden whitespace-nowrap",
                        current === repo && "text-primary"
                      )}
                      style={{ display: "inline-block" }}
                    >
                      {current === repo ? "Unbind" : "Bind"}
                    </motion.span>
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </CardWrapper>
  )
}

export default BindRepository
