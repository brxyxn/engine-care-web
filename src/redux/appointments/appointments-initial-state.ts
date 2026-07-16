import { AppointmentsSlice } from "@/redux/appointments/appointments-types"
import { SliceStatus } from "@/redux/types"

export const appointmentsInitialState: AppointmentsSlice = {
  state: null,
  status: SliceStatus.IDLE,
}
