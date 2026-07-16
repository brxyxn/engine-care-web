import { createAppSlice } from "@/redux/create-app-slice"
import { dashboardInitialState } from "@/redux/dashboard/dashboard-initial-state"
import {
  fetchDashboardActivity,
  fetchDashboardStats,
  fetchServiceStats,
} from "@/redux/dashboard/dashboard-thunks"
import { DashboardState } from "@/redux/dashboard/dashboard-types"
import { SliceStatus } from "@/redux/types"

const emptyState: DashboardState = {
  stats: null,
  activity: [],
  serviceStats: null,
}

export const dashboardSlice = createAppSlice({
  name: "dashboard",
  initialState: dashboardInitialState,
  reducers: () => ({}),
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (slice) => {
        slice.status = SliceStatus.LOADING
      })
      .addCase(fetchDashboardStats.fulfilled, (slice, action) => {
        slice.state = { ...(slice.state ?? emptyState), stats: action.payload }
        slice.status = SliceStatus.SUCCEEDED
      })
      .addCase(fetchDashboardStats.rejected, (slice) => {
        slice.status = SliceStatus.FAILED
      })
      .addCase(fetchDashboardActivity.fulfilled, (slice, action) => {
        slice.state = {
          ...(slice.state ?? emptyState),
          activity: action.payload,
        }
      })
      .addCase(fetchServiceStats.fulfilled, (slice, action) => {
        slice.state = {
          ...(slice.state ?? emptyState),
          serviceStats: action.payload,
        }
      })
  },
  selectors: {
    selectDashboardStats: (slice) => slice.state?.stats ?? null,
    selectDashboardActivity: (slice) => slice.state?.activity ?? [],
    selectServiceStats: (slice) => slice.state?.serviceStats ?? null,
    selectDashboardStatus: (slice) => slice.status,
  },
})

export const {
  selectDashboardStats,
  selectDashboardActivity,
  selectServiceStats,
  selectDashboardStatus,
} = dashboardSlice.selectors
