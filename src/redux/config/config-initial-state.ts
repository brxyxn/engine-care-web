import { ConfigSlice } from "@/redux/config/config-types"
import { SliceStatus } from "@/redux/types"

export const configInitialState: ConfigSlice = {
  state: null,
  status: SliceStatus.IDLE,
}
