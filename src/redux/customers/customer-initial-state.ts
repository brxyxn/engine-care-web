import { CustomerSlice } from "@/redux/customers/customer-types"
import { SliceStatus } from "@/redux/types"

export const customerInitialState: CustomerSlice = {
  state: null,
  status: SliceStatus.IDLE,
}
