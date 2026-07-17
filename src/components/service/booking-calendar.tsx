"use client"

import { useMemo, useState } from "react"
import { format, isSameDay } from "date-fns"
import { Plus } from "lucide-react"
import { AppointmentAgendaRow } from "@/components/service/appointment-agenda-row"
import { AppointmentDialog } from "@/components/service/appointment-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type BookingCalendarProps = {
  appointments: Appointment[]
  customers?: Customer[]
  vehicles?: Vehicle[]
  workOrders?: WorkOrder[]
  canBook?: boolean
  requireWorkOrder?: boolean
}

export function BookingCalendar({
  appointments,
  customers = [],
  vehicles = [],
  workOrders = [],
  canBook = false,
  requireWorkOrder = false,
}: BookingCalendarProps) {
  const [selected, setSelected] = useState<Date>(() => new Date())
  const [bookOpen, setBookOpen] = useState(false)
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null)

  const customerById = useMemo(
    () => new Map(customers.map((c) => [c.id, c])),
    [customers]
  )

  const daySlots = appointments
    .filter((a) => isSameDay(new Date(a.scheduledAt), selected))
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    )

  const bookedDays = appointments.map((a) => new Date(a.scheduledAt))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendar Booking</CardTitle>
        {canBook && (
          <Button size="sm" onClick={() => setBookOpen(true)}>
            <Plus className="size-4" />
            Book
          </Button>
        )}
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
          <div className="flex flex-col gap-2">
            {daySlots.map((appointment) => (
              <AppointmentAgendaRow
                key={appointment.id}
                appointment={appointment}
                customer={customerById.get(appointment.customerId)}
                onReschedule={setRescheduling}
              />
            ))}
          </div>
        </div>
      </CardContent>

      {canBook && (
        <AppointmentDialog
          mode="book"
          open={bookOpen}
          onOpenChange={setBookOpen}
          customers={customers}
          vehicles={vehicles}
          workOrders={workOrders}
          defaultDate={selected}
          requireWorkOrder={requireWorkOrder}
        />
      )}
      {rescheduling && (
        <AppointmentDialog
          mode="reschedule"
          appointment={rescheduling}
          open={rescheduling !== null}
          onOpenChange={(open) => !open && setRescheduling(null)}
        />
      )}
    </Card>
  )
}
