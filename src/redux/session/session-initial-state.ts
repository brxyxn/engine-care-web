import { SessionSlice } from "@/redux/session/session-types"
import { SliceStatus } from "@/redux/types"

export const sessionInitialState: SessionSlice = {
  state: null,
  status: SliceStatus.IDLE,
}
