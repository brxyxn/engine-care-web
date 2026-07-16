import { api } from "@/lib/api"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchDashboardStats = createAsyncThunk(
  "dashboard/fetchStats",
  async () => api.get<DashboardStats>("/dashboard/stats")
)

export const fetchDashboardActivity = createAsyncThunk(
  "dashboard/fetchActivity",
  async () => api.get<ActivityEntry[]>("/dashboard/activity")
)

export const fetchServiceStats = createAsyncThunk(
  "dashboard/fetchServiceStats",
  async () => api.get<ServiceStats>("/service/stats")
)
