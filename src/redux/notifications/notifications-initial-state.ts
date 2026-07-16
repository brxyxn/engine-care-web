import { NotificationsSlice } from "@/redux/notifications/notifications-types"
import { SliceStatus } from "@/redux/types"

export const notificationsInitialState: NotificationsSlice = {
  state: null,
  status: SliceStatus.IDLE,
}
