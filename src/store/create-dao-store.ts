"use client"

import { atom, createStore } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { type DaoInformationParams, type LaunchParams } from "~/lib/schema"
import { DaoType } from "@prisma/client"
import { type CreateDaoStep } from "~/types/data"

const createDaoStore = createStore()


export const stepAtom = atomWithStorage<CreateDaoStep>("sgp-create-dao-step", "BIND")
export const daoInformationAtom = atomWithStorage<DaoInformationParams>("sgp-create-dao-params", {
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

export const stepPath = {
  BIND: "/create/bind",
  INFORMATION: "/create/information",
  LAUNCH: "/create/launch",
  FINISH: "/create/finish"
}

export default createDaoStore
