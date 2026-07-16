import { RootSlice } from "@/redux/types"

export type NotificationsState = {
  notifications: AppNotification[]
  reminders: Reminder[]
}

export type NotificationsSlice = RootSlice<NotificationsState>
