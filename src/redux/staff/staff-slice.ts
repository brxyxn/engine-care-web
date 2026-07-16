import { createAppSlice } from "@/redux/create-app-slice"
import { staffInitialState } from "@/redux/staff/staff-initial-state"
import { fetchStaff } from "@/redux/staff/staff-thunks"
import { SliceStatus } from "@/redux/types"

export const staffSlice = createAppSlice({
  name: "staff",
  initialState: staffInitialState,
  reducers: () => ({}),
  extraReducers: (builder) => {
    builder
      .addCase(fetchStaff.pending, (slice) => {
        slice.status = SliceStatus.LOADING
      })
      .addCase(fetchStaff.fulfilled, (slice, action) => {
        slice.state = action.payload
        slice.status = SliceStatus.SUCCEEDED
      })
      .addCase(fetchStaff.rejected, (slice) => {
        slice.status = SliceStatus.FAILED
      })
  },
  selectors: {
    selectStaff: (slice) => slice.state,
    selectStaffStatus: (slice) => slice.status,
  },
})

export const { selectStaff, selectStaffStatus } = staffSlice.selectors
