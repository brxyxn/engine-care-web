import { createAppSlice } from "@/redux/create-app-slice"
import { notificationsInitialState } from "@/redux/notifications/notifications-initial-state"
import {
  fetchNotifications,
  fetchReminders,
} from "@/redux/notifications/notifications-thunks"
import { NotificationsState } from "@/redux/notifications/notifications-types"
import { SliceStatus } from "@/redux/types"

const emptyState: NotificationsState = {
  notifications: [],
  reminders: [],
}

export const notificationsSlice = createAppSlice({
  name: "notifications",
  initialState: notificationsInitialState,
  reducers: () => ({}),
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (slice) => {
        slice.status = SliceStatus.LOADING
      })
      .addCase(fetchNotifications.fulfilled, (slice, action) => {
        slice.state = {
          ...(slice.state ?? emptyState),
          notifications: action.payload,
        }
        slice.status = SliceStatus.SUCCEEDED
      })
      .addCase(fetchNotifications.rejected, (slice) => {
        slice.status = SliceStatus.FAILED
      })
      .addCase(fetchReminders.fulfilled, (slice, action) => {
        slice.state = {
          ...(slice.state ?? emptyState),
          reminders: action.payload,
        }
      })
  },
  selectors: {
    selectNotifications: (slice) => slice.state?.notifications ?? [],
    selectReminders: (slice) => slice.state?.reminders ?? [],
    selectUnreadCount: (slice) =>
      slice.state?.notifications.filter((n) => !n.read).length ?? 0,
    selectNotificationsStatus: (slice) => slice.status,
  },
})

export const {
  selectNotifications,
  selectReminders,
  selectUnreadCount,
  selectNotificationsStatus,
} = notificationsSlice.selectors
