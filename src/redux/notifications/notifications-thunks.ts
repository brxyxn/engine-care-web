import { api } from "@/lib/api"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchNotifications = createAsyncThunk(
  "notifications/fetch",
  async () => api.get<AppNotification[]>("/notifications")
)

export const fetchReminders = createAsyncThunk(
  "notifications/fetchReminders",
  async () => api.get<Reminder[]>("/reminders")
)
