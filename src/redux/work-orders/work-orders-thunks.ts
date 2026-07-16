import { api } from "@/lib/api"
import { WorkOrderFilters } from "@/redux/work-orders/work-orders-types"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchWorkOrders = createAsyncThunk(
  "workOrders/fetch",
  async (filters?: WorkOrderFilters) =>
    api.get<WorkOrder[]>("/work-orders", filters as Record<string, string>)
)

export const createWorkOrder = createAsyncThunk(
  "workOrders/create",
  async (input: Partial<WorkOrder>) =>
    api.post<WorkOrder>("/work-orders", input)
)

/** Kanban moves, assignee changes, note appends. */
export const updateWorkOrder = createAsyncThunk(
  "workOrders/update",
  async ({ id, patch }: { id: string; patch: Partial<WorkOrder> }) =>
    api.patch<WorkOrder>(`/work-orders/${id}`, patch)
)
