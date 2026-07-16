import { SliceStatus } from "@/redux/types"
import { WorkOrdersSlice } from "@/redux/work-orders/work-orders-types"

export const workOrdersInitialState: WorkOrdersSlice = {
  state: null,
  status: SliceStatus.IDLE,
}
