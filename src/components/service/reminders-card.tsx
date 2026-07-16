"use client"

import { useState } from "react"
import { formatDistanceToNow } from "date-fns"
import { StatusBadge } from "@/components/shared/status-badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { MessageSquareText } from "lucide-react"

export type RemindersCardProps = {
  reminders: Reminder[]
  customers: Customer[]
}

export function RemindersCard({ reminders, customers }: RemindersCardProps) {
  const [dismissed, setDismissed] = useState<string[]>([])
  const customerById = new Map(customers.map((c) => [c.id, c]))

  const visible = reminders
    .filter((reminder) => !dismissed.includes(reminder.id))
    .sort((a, b) => (a.urgency === "urgent" ? -1 : b.urgency === "urgent" ? 1 : 0))

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquareText className="size-4" />
          Customer Reminders
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {visible.length === 0 && (
          <p className="text-muted-foreground py-6 text-center text-sm">
            All caught up — reminders send automatically.
          </p>
        )}
        {visible.map((reminder) => {
          const customer = customerById.get(reminder.relatedCustomerId)
          return (
            <div
              key={reminder.id}
              className="bg-muted/40 flex flex-col gap-2 rounded-xl p-3"
            >
              <div className="flex items-center justify-between gap-2">
                {reminder.urgency === "urgent" ? (
                  <StatusBadge tone="destructive">Urgent</StatusBadge>
                ) : (
                  <StatusBadge tone="muted">Sent</StatusBadge>
                )}
                <span className="text-muted-foreground text-xs">
                  {formatDistanceToNow(new Date(reminder.sentAt), {
                    addSuffix: true,
                  })}
                </span>
              </div>
              <p className="text-sm font-medium">{reminder.title}</p>
              <p className="text-muted-foreground text-xs">{reminder.body}</p>
              <div className="flex gap-2">
                {customer && (
                  <Button size="sm" variant="secondary" asChild>
                    <a href={`tel:${customer.phone.replace(/\s/g, "")}`}>
                      Call now
                    </a>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() =>
                    setDismissed((prev) => [...prev, reminder.id])
                  }
                >
                  Dismiss
                </Button>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
