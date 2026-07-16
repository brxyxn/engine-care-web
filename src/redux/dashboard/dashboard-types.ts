import { RootSlice } from "@/redux/types"

export type DashboardState = {
  stats: DashboardStats | null
  activity: ActivityEntry[]
  serviceStats: ServiceStats | null
}

export type DashboardSlice = RootSlice<DashboardState>
