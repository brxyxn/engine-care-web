import { createAppSlice } from "@/redux/create-app-slice"
import { sessionInitialState } from "@/redux/session/session-initial-state"
import { fetchSession, switchRole } from "@/redux/session/session-thunks"
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
        // Keep a previously switched role across reloads (state is persisted)
        if (!slice.state) {
          slice.state = action.payload
        }
        slice.status = SliceStatus.SUCCEEDED
      })
      .addCase(fetchSession.rejected, (slice) => {
        slice.status = SliceStatus.FAILED
      })
      .addCase(switchRole.fulfilled, (slice, action) => {
        slice.state = action.payload
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
