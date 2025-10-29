import { CustomerSlice } from "@/redux/customers/types"
import { SliceStatus } from "@/redux/types"

export const initialState: CustomerSlice = {
  state: null,
  status: SliceStatus.IDLE,
}
