import { DashboardSlice } from "@/redux/dashboard/dashboard-types"
import { SliceStatus } from "@/redux/types"

export const dashboardInitialState: DashboardSlice = {
  state: null,
  status: SliceStatus.IDLE,
}
