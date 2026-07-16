import { appointmentsSlice } from "@/redux/appointments/appointments-slice"
import { counterSlice } from "@/redux/counter/counter-slice"
import { customerSlice } from "@/redux/customers/customer-slice"
import { dashboardSlice } from "@/redux/dashboard/dashboard-slice"
import { invoicesSlice } from "@/redux/invoices/invoices-slice"
import { notificationsSlice } from "@/redux/notifications/notifications-slice"
import { sessionSlice } from "@/redux/session/session-slice"
import { staffSlice } from "@/redux/staff/staff-slice"
import { vehiclesSlice } from "@/redux/vehicles/vehicles-slice"
import { workOrdersSlice } from "@/redux/work-orders/work-orders-slice"

const allSlices = [
  counterSlice,
  customerSlice,
  sessionSlice,
  dashboardSlice,
  notificationsSlice,
  vehiclesSlice,
  workOrdersSlice,
  appointmentsSlice,
  invoicesSlice,
  staffSlice,
]

export default allSlices
