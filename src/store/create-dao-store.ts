"use client"

import { atom, createStore } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { type LaunchParams } from "~/lib/schema"
import { DaoType, Prisma } from "@prisma/client"
import { type CreateDaoStep } from "~/types/data"
import { z } from "zod"
import { DaoTypeSchema } from "~/lib/zod"

const createDaoStore = createStore()
export const assetTokenSchema = z.object({
  address: z.string(),
  name: z.string(),
  symbol: z.string(),
  decimals: z.number().int(),
  isAllowed: z.boolean(),
  isNative: z.boolean(),
  launchFee: z.instanceof(Prisma.Decimal, {
    message:
      "Field 'launchFee' must be a Decimal. Location: ['Models', 'AssetToken']"
  })
})

export const daoRepositoryFormsSchema = z.object({
  url: z.string({ message: "repo url is required." })
})

export const daoInformationFormsSchema = z.object({
  avatar: z
    .string({ message: "Avatar is required." })
    .refine((value) => value.trim() !== "", {
      message: "Avatar can not be empty."
    }),
  type: DaoTypeSchema,
  name: z
    .string({ message: "Name is required." })
    .min(1, { message: "Name can not be empty." }),
  ticker: z
    .string({ message: "Ticker is required." })
    .min(1, { message: "Ticker can not be empty." })
    .regex(/^[A-Za-z]+$/, { message: "Only letters are allowed." })
    .transform((v) => v.toUpperCase()),
  description: z
    .string({ message: "Description is required." })
    .min(1, { message: "Description can not be empty." }),
  x: z.string().url().optional().or(z.literal("")),
  telegram: z.string().url().optional().or(z.literal("")),
  website: z.string().url().optional().or(z.literal("")),
  assetAddress: z.string({ message: "Asset must select." })
})

export const daoFormsSchema = daoRepositoryFormsSchema
  .merge(daoInformationFormsSchema)

export type DaoForms = z.infer<typeof daoFormsSchema>;
export type DaoInformationForms = z.infer<typeof daoInformationFormsSchema>;
export const stepAtom = atomWithStorage<CreateDaoStep>(
  "sgp-create-dao-step",
  "BIND",
)
export const daoFormsAtom = atomWithStorage<DaoForms>("sgp-create-dao-params", {
  avatar: "",
  url: "",
  type: DaoType.CODE,
  name: "",
  ticker: "",
  description: "",
  x: "",
  telegram: "",
  website: "",
  assetAddress: ""
})

export const launchAtom = atom<LaunchParams>()

export const stepPath = {
  BIND: "/create/bind",
  INFORMATION: "/create/information",
  FINISH: "/create/finish"
}

export default createDaoStore
