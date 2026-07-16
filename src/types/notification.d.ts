type NotificationKind = "reminder" | "system" | "payment"

type NotificationUrgency = "low" | "normal" | "urgent"

type ReminderChannel = "sms" | "email" | "in_app"

type AppNotification = {
  id: string
  kind: NotificationKind
  urgency: NotificationUrgency
  title: string
  body: string
  relatedCustomerId: string | null
  relatedWorkOrderId: string | null
  createdAt: string
  read: boolean
}

/** An automated reminder the system sent on the shop's behalf */
type Reminder = {
  id: string
  urgency: NotificationUrgency
  title: string
  body: string
  channel: ReminderChannel
  relatedCustomerId: string
  relatedWorkOrderId: string | null
  sentAt: string
}
