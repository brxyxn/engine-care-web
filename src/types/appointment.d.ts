type AppointmentType = "drop_off" | "pickup" | "inspection" | "service"

type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show"

type Appointment = {
  id: string
  customerId: string
  vehicleId: string
  workOrderId: string | null
  type: AppointmentType
  scheduledAt: string
  durationMin: number
  status: AppointmentStatus
}
