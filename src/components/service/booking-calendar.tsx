"use client"

import { useState } from "react"
import { format, isSameDay } from "date-fns"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

export type BookingCalendarProps = {
  appointments: Appointment[]
}

export function BookingCalendar({ appointments }: BookingCalendarProps) {
  const [selected, setSelected] = useState<Date>(() => new Date())

  const daySlots = appointments
    .filter((a) => isSameDay(new Date(a.scheduledAt), selected))
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    )

  const bookedDays = appointments.map((a) => new Date(a.scheduledAt))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendar Booking</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => date && setSelected(date)}
          modifiers={{ booked: bookedDays }}
          modifiersClassNames={{
            booked:
              "after:bg-primary relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full",
          }}
          className="mx-auto"
        />
        <div className="border-border/60 border-t pt-3">
          <p className="text-muted-foreground mb-2 text-sm">
            {format(selected, "EEEE, MMM d")} ·{" "}
            {daySlots.length === 0
              ? "no bookings"
              : `${daySlots.length} booked`}
          </p>
          <div className="flex flex-wrap gap-2">
            {daySlots.map((appointment) => (
              <span
                key={appointment.id}
                className={cn(
                  "bg-chart-2/15 text-chart-2 rounded-full px-3 py-1.5 text-xs font-medium",
                  appointment.status === "pending" && "opacity-70"
                )}
              >
                {format(new Date(appointment.scheduledAt), "h:mm a")}
              </span>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
