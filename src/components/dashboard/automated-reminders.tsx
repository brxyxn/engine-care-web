"use client"

import { formatDistanceToNow } from "date-fns"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail, MessageSquareText, Monitor } from "lucide-react"

const channelIcons = {
  sms: MessageSquareText,
  email: Mail,
  in_app: Monitor,
} as const

const channelLabels = {
  sms: "SMS",
  email: "Email",
  in_app: "In-app",
} as const

export type AutomatedRemindersProps = {
  reminders: Reminder[]
}

/** What the system sent on the shop's behalf — the automation surface. */
export function AutomatedReminders({ reminders }: AutomatedRemindersProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Automated Reminders</CardTitle>
        <CardDescription>
          Sent for you — no follow-up needed unless flagged
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {reminders.length === 0 && (
          <p className="text-muted-foreground py-6 text-center text-sm">
            No reminders sent yet.
          </p>
        )}
        {reminders.map((reminder) => {
          const ChannelIcon = channelIcons[reminder.channel]
          return (
            <div
              key={reminder.id}
              className="bg-muted/40 flex flex-col gap-1.5 rounded-xl p-3"
            >
              <div className="flex items-center gap-2">
                <span className="bg-primary/12 text-primary flex size-7 shrink-0 items-center justify-center rounded-lg">
                  <ChannelIcon className="size-3.5" />
                </span>
                <span className="flex-1 text-sm font-medium">
                  {reminder.title}
                </span>
                {reminder.urgency === "urgent" && (
                  <StatusBadge tone="destructive">Urgent</StatusBadge>
                )}
              </div>
              <p className="text-muted-foreground text-xs">{reminder.body}</p>
              <p className="text-muted-foreground/70 text-xs">
                {channelLabels[reminder.channel]} ·{" "}
                {formatDistanceToNow(new Date(reminder.sentAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
