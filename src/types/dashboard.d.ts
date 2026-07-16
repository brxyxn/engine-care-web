type KpiDelta = {
  /** Signed change vs the comparison period, in the same unit as value */
  amount: number
  /** e.g. "vs last month", "this period" */
  label: string
  direction: "up" | "down" | "flat"
}

type DashboardStats = {
  vehiclesInService: { value: number; delta: KpiDelta }
  activeCustomers: { value: number; delta: KpiDelta }
  monthlyRevenue: { value: number; delta: KpiDelta }
  /** Weekly series for the bookings overview chart */
  bookings: {
    week: string
    workOrders: number
    appointments: number
  }[]
  /** Share of open work orders by service type, percentages 0-100 */
  serviceRequests: {
    serviceType: ServiceType
    pct: number
  }[]
}

type ActivityEntry = {
  id: string
  customerId: string
  vehicleId: string
  type: "sale" | "service"
  status: "complete" | "pending" | "in_progress"
  value: number
  at: string
}

type ServiceStats = {
  appointmentsToday: { value: number; delta: KpiDelta }
  serviceRevenue: { value: number; delta: KpiDelta }
  completedServices: { value: number; delta: KpiDelta }
  pendingRepairs: { value: number; delta: KpiDelta }
  payments: {
    outstandingTotal: number
    expectedToday: number
    collectionRatePct: number
  }
}
