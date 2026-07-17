import * as seed from "@/app/api/_mock/db"

/**
 * Mutable in-memory store for the mock API. Route handlers mutate these arrays
 * so creates/edits/deletes persist across requests within a single running
 * server process (they reset on server restart / HMR reload). The Go backend
 * replaces this with a real database — the shapes are the contract.
 */
type MockStore = {
  customers: Customer[]
  vehicles: Vehicle[]
  workOrders: WorkOrder[]
  appointments: Appointment[]
  invoices: Invoice[]
  staff: StaffMember[]
  notifications: AppNotification[]
  reminders: Reminder[]
}

// Survive HMR in dev by stashing the store on globalThis.
const globalForStore = globalThis as unknown as { __ecStore?: MockStore }

export const store: MockStore =
  globalForStore.__ecStore ??
  (globalForStore.__ecStore = {
    customers: structuredClone(seed.customers),
    vehicles: structuredClone(seed.vehicles),
    workOrders: structuredClone(seed.workOrders),
    appointments: structuredClone(seed.appointments),
    invoices: structuredClone(seed.invoices),
    staff: structuredClone(seed.staff),
    notifications: structuredClone(seed.notifications),
    reminders: structuredClone(seed.reminders),
  })

let idCounter = 2000
export const nextId = (prefix: string) => `${prefix}_${idCounter++}`

// Human-readable work order numbers continue the seed sequence (…0491 → 0492).
let workOrderSeq = 492
export const nextWorkOrderNumber = () =>
  `WO-${String(workOrderSeq++).padStart(4, "0")}`
