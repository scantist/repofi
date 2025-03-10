"use client"

import { atom, createStore } from "jotai"
import { type CreateDaoParams } from "~/lib/schema"
import { DaoTypeSchema } from "~/lib/zod"
import { DaoType } from "@prisma/client"

const createDaoStore = createStore()

export type CreateDaoStep = "BIND" | "INFORMATION" | "WALLET" | "FINISH"

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

export const stepPath = {
  BIND: "/create/bind",
  INFORMATION: "/create/information",
  WALLET: "/create/wallet",
  FINISH: "/create/finish"
}

export default createDaoStore
