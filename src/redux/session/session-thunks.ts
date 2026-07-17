import { api } from "@/lib/api"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchSession = createAsyncThunk("session/fetch", async () =>
  api.get<Session>("/session")
)

export const login = createAsyncThunk(
  "session/login",
  async (credentials: { email: string; password: string }) =>
    api.post<Session>("/auth/login", credentials)
)

export const signup = createAsyncThunk(
  "session/signup",
  async (input: {
    name: string
    email: string
    password: string
    shopName: string
  }) => api.post<Session>("/auth/signup", input)
)

export const logout = createAsyncThunk("session/logout", async () => {
  await api.post<null>("/auth/logout")
})
