import {createTRPCRouter, publicProcedure} from "~/server/api/trpc"
import {dashboardService} from "~/server/service/dashboard";

export const dashboardRouter = createTRPCRouter({
  home: publicProcedure.query(() => {
    return dashboardService.home()
  }),

})
