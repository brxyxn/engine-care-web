import { api } from "@/lib/api"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchSession = createAsyncThunk("session/fetch", async () =>
  api.get<Session>("/session")
)

/** Dev-only role switcher; real role will come from auth. */
export const switchRole = createAsyncThunk(
  "session/switchRole",
  async (role: StaffRole) => api.post<Session>("/session/role", { role })
)
