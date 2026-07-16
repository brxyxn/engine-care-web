import { createAppSlice } from "@/redux/create-app-slice"
import { SliceStatus } from "@/redux/types"
import { workOrdersInitialState } from "@/redux/work-orders/work-orders-initial-state"
import {
  createWorkOrder,
  fetchWorkOrders,
  updateWorkOrder,
} from "@/redux/work-orders/work-orders-thunks"
import { PayloadAction } from "@reduxjs/toolkit"

export const workOrdersSlice = createAppSlice({
  name: "workOrders",
  initialState: workOrdersInitialState,
  reducers: (create) => ({
    /** Optimistic kanban move; the PATCH thunk confirms it. */
    moveWorkOrder: create.reducer(
      (
        slice,
        action: PayloadAction<{ id: string; status: WorkOrderStatus }>
      ) => {
        const workOrder = slice.state?.find((wo) => wo.id === action.payload.id)
        if (workOrder) {
          workOrder.status = action.payload.status
          if (action.payload.status === "ready") {
            workOrder.progressPct = 100
          }
        }
      }
    ),
  }),
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkOrders.pending, (slice) => {
        slice.status = SliceStatus.LOADING
      })
      .addCase(fetchWorkOrders.fulfilled, (slice, action) => {
        slice.state = action.payload
        slice.status = SliceStatus.SUCCEEDED
      })
      .addCase(fetchWorkOrders.rejected, (slice) => {
        slice.status = SliceStatus.FAILED
      })
      .addCase(createWorkOrder.fulfilled, (slice, action) => {
        slice.state = [action.payload, ...(slice.state ?? [])]
      })
      .addCase(updateWorkOrder.fulfilled, (slice, action) => {
        slice.state =
          slice.state?.map((wo) =>
            wo.id === action.payload.id ? action.payload : wo
          ) ?? null
      })
  },
  selectors: {
    selectWorkOrders: (slice) => slice.state,
    selectWorkOrdersStatus: (slice) => slice.status,
  },
})

export const { moveWorkOrder } = workOrdersSlice.actions

export const { selectWorkOrders, selectWorkOrdersStatus } =
  workOrdersSlice.selectors
