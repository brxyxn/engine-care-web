import { RootSlice } from "@/redux/types"

export type AppointmentFilters = {
  customerId?: string
  status?: AppointmentStatus
}

export type AppointmentsSlice = RootSlice<Appointment[]>
