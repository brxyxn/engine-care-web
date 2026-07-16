type WorkOrderStatus =
  | "intake"
  | "diagnostics"
  | "in_repair"
  | "waiting_parts"
  | "ready"
  | "delivered"

type WorkOrderPriority = "low" | "normal" | "high" | "urgent"

type ServiceType =
  | "engine_diagnostic"
  | "brake_system"
  | "tire_rotation"
  | "electrical"
  | "general_repair"
  | "inspection"
  | "maintenance"

type WorkOrderLineItem = {
  description: string
  qty: number
  unitPrice: number
}

type WorkOrderNote = {
  id: string
  authorId: string
  body: string
  at: string
}

type WorkOrder = {
  id: string
  /** Human-readable order number, e.g. "WO-0482" */
  number: string
  customerId: string
  vehicleId: string
  assignedMechanicId: string | null
  status: WorkOrderStatus
  priority: WorkOrderPriority
  serviceType: ServiceType
  title: string
  description: string
  /** 0-100, coarse completion indicator shown on status boards */
  progressPct: number
  lineItems: WorkOrderLineItem[]
  estimateTotal: number
  scheduledAt: string | null
  completedAt: string | null
  notes: WorkOrderNote[]
  createdAt: string
}
