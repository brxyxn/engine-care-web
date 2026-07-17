import { appointmentsInitialState } from "@/redux/appointments/appointments-initial-state"
import {
  createAppointment,
  fetchAppointments,
  updateAppointment,
} from "@/redux/appointments/appointments-thunks"
import { createAppSlice } from "@/redux/create-app-slice"
import { SliceStatus } from "@/redux/types"

export const appointmentsSlice = createAppSlice({
  name: "appointments",
  initialState: appointmentsInitialState,
  reducers: () => ({}),
  extraReducers: (builder) => {
    builder
      .addCase(fetchAppointments.pending, (slice) => {
        slice.status = SliceStatus.LOADING
      })
      .addCase(fetchAppointments.fulfilled, (slice, action) => {
        slice.state = action.payload
        slice.status = SliceStatus.SUCCEEDED
      })
      .addCase(fetchAppointments.rejected, (slice) => {
        slice.status = SliceStatus.FAILED
      })
      .addCase(updateAppointment.fulfilled, (slice, action) => {
        slice.state =
          slice.state?.map((a) =>
            a.id === action.payload.id ? action.payload : a
          ) ?? null
      })
      .addCase(createAppointment.fulfilled, (slice, action) => {
        slice.state = [action.payload, ...(slice.state ?? [])]
      })
  },
  selectors: {
    selectAppointments: (slice) => slice.state,
    selectAppointmentsStatus: (slice) => slice.status,
  },
})

export const { selectAppointments, selectAppointmentsStatus } =
  appointmentsSlice.selectors
