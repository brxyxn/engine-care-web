import { api } from "@/lib/api"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchStaff = createAsyncThunk("staff/fetch", async () =>
  api.get<StaffMember[]>("/staff")
)
