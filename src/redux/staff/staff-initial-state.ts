import { StaffSlice } from "@/redux/staff/staff-types"
import { SliceStatus } from "@/redux/types"

export const staffInitialState: StaffSlice = {
  state: null,
  status: SliceStatus.IDLE,
}
