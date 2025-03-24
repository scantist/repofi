"use server"

import { daoService } from "~/server/service/dao"

export const getAgentChartDataAction = async (tokenId: bigint, to: number, countBack: number, resolution: string) => {
  const data = await daoService.chart(tokenId, to, countBack, resolution)
  return data
}
