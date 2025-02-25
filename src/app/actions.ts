import { type HomeSearchParams } from "~/lib/schema"

export const getDaoListAction = async ({
  page = 0,
  search,
  orderBy,
  onlyLaunched,
  owned,
  starred
}: HomeSearchParams & { page?: number }) => {
  // TODO: Add list
  return []
}
