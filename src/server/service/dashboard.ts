import { db } from "../db";
import {DaoStatus} from "@prisma/client";

class DashboardService{
  async home() {
    const total = await db.dao.count()
    const marketCapByStatus = await db.dao.groupBy({
      by: ['status'],
      _sum: {
        marketCapUsd: true
      }
    });
    const result = {
      total: total,
      marketCap: Object.fromEntries(
        marketCapByStatus.map(item => [
          item.status,
          item._sum.marketCapUsd||0
        ])
      )
    };

    for (const status of Object.values(DaoStatus)) {
      if (!(status in result.marketCap)) {
        result.marketCap[status] = 0;
      }
    }

    return result;
  }
}
export const dashboardService=new DashboardService()
