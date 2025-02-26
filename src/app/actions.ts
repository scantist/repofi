import { type HomeSearchParams } from "~/lib/schema"
import { daoRouter } from "~/server/api/routers/dao"
import { daoService } from "~/server/service/dao"
import { auth } from "~/server/auth"

export const getDaoListAction = async (params: HomeSearchParams & { page?: number }) => {
  const session = await auth()
  const homeSearch = await daoService.homeSearch({ ...params },
    { page: params.page?? 0, size: 10  }, session?.address)
  console.log(homeSearch)
  return homeSearch
}
