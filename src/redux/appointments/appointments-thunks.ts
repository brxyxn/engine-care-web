import { api } from "@/lib/api"
import { AppointmentFilters } from "@/redux/appointments/appointments-types"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchAppointments = createAsyncThunk(
  "appointments/fetch",
  async (filters?: AppointmentFilters) =>
    api.get<Appointment[]>("/appointments", filters as Record<string, string>)
)

/** Book a new appointment. Server sets id + status: "pending". */
export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (input: Omit<Appointment, "id" | "status">) =>
    api.post<Appointment>("/appointments", input)
)

/** Confirm, reschedule, or cancel. */
export const updateAppointment = createAsyncThunk(
  "appointments/update",
  async ({ id, patch }: { id: string; patch: Partial<Appointment> }) =>
    api.patch<Appointment>(`/appointments/${id}`, patch)
)
