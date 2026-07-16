import { RootSlice } from "@/redux/types"

export type WorkOrderFilters = {
  status?: WorkOrderStatus
  assignedMechanicId?: string
}

export type WorkOrdersSlice = RootSlice<WorkOrder[]>
