"use client"

import { atom, createStore } from "jotai"
import { type CreateDaoParams, type LaunchParams } from "~/lib/schema"
import { DaoTypeSchema } from "~/lib/zod"
import { DaoType } from "@prisma/client"

const createDaoStore = createStore()

export type CreateDaoStep = "BIND" | "INFORMATION" | "LAUNCH" | "FINISH"

export const stepAtom = atom<CreateDaoStep>("BIND")
export const createDaoAtom = atom<CreateDaoParams>({
  avatar: "",
  url: "",
  type: DaoType.CODE,
  name: "",
  ticker: "",
  description: "",
  x: "",
  telegram: "",
  website: ""
})

export const launchAtom = atom<LaunchParams>()

createDaoStore.set(stepAtom, "BIND")
createDaoStore.set(createDaoAtom, {
  avatar: "",
  url: "",
  type: DaoType.CODE,
  name: "",
  ticker: "",
  description: "",
  x: "",
  telegram: "",
  website: ""
})
createDaoStore.set(launchAtom, undefined)

export const stepPath = {
  BIND: "/create/bind",
  INFORMATION: "/create/information",
  LAUNCH: "/create/launch",
  FINISH: "/create/finish"
}

export default createDaoStore
