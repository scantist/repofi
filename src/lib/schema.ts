import { z } from "zod"

export const pageableSchema = z.object({
  page: z.number().optional().default(1),
  size: z.number().optional().default(12)
})

export const homeSearchParamsSchema = z.object({
  search: z.string().optional(),
  orderBy: z
    .enum(["latest", "marketCap"])
    .optional()
    .default("marketCap")
    .catch("marketCap"),
  onlyLaunched: z.preprocess(
    (val) => val !== undefined && val !== "false",
    z.boolean().optional().default(false),
  ),
  owned: z.preprocess(
    (val) => val !== undefined && val !== "false",
    z.boolean().optional().default(false),
  ),
  starred: z.preprocess(
    (val) => val !== undefined && val !== "false",
    z.boolean().optional().default(false),
  )
})

export type HomeSearchParams = z.infer<typeof homeSearchParamsSchema>;
export type Pageable = z.infer<typeof pageableSchema>;
