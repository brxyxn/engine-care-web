import { createAppSlice } from "@/redux/create-app-slice"
import { sessionInitialState } from "@/redux/session/session-initial-state"
import {
  fetchSession,
  login,
  logout,
  signup,
} from "@/redux/session/session-thunks"
import { SliceStatus } from "@/redux/types"

export const sessionSlice = createAppSlice({
  name: "session",
  initialState: sessionInitialState,
  reducers: () => ({}),
  extraReducers: (builder) => {
    builder
      .addCase(fetchSession.pending, (slice) => {
        slice.status = SliceStatus.LOADING
      })
      .addCase(fetchSession.fulfilled, (slice, action) => {
        slice.state = action.payload
        slice.status = SliceStatus.SUCCEEDED
      })
      .addCase(fetchSession.rejected, (slice) => {
        // 401 → signed out
        slice.state = null
        slice.status = SliceStatus.FAILED
      })
      .addCase(login.fulfilled, (slice, action) => {
        slice.state = action.payload
        slice.status = SliceStatus.SUCCEEDED
      })
      .addCase(signup.fulfilled, (slice, action) => {
        slice.state = action.payload
        slice.status = SliceStatus.SUCCEEDED
      })
      .addCase(logout.fulfilled, (slice) => {
        slice.state = null
        slice.status = SliceStatus.FAILED
      })
  },
  selectors: {
    selectSession: (slice) => slice.state,
    selectRole: (slice) => slice.state?.user.role ?? null,
    selectSessionStatus: (slice) => slice.status,
  },
})

export const { selectSession, selectRole, selectSessionStatus } =
  sessionSlice.selectors
