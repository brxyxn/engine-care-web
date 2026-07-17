"use client"

import { useState } from "react"
import { format, isToday, isTomorrow } from "date-fns"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  appointmentStatusLabels,
  appointmentStatusTones,
  appointmentTypeLabels,
} from "@/lib/format"

const dayLabel = (date: Date) => {
  if (isToday(date)) return "Today"
  if (isTomorrow(date)) return "Tomorrow"
  return format(date, "EEE, MMM d")
}

export type UpcomingAppointmentsProps = {
  appointments: Appointment[]
  customers: Customer[]
  vehicles: Vehicle[]
  limit?: number
}

export function UpcomingAppointments({
  appointments,
  customers,
  vehicles,
  limit = 5,
}: UpcomingAppointmentsProps) {
  // Reference time captured once per mount; render stays pure
  const [now] = useState(() => Date.now())
  const customerById = new Map(customers.map((c) => [c.id, c]))
  const vehicleById = new Map(vehicles.map((v) => [v.id, v]))

  const upcoming = appointments
    .filter(
      (a) =>
        new Date(a.scheduledAt).getTime() >= now - 60 * 60 * 1000 &&
        (a.status === "pending" || a.status === "confirmed")
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    )
    .slice(0, limit)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>Next scheduled drop-offs and pickups</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>When</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {upcoming.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-8 text-center"
                >
                  No upcoming appointments. Book one from the Service page.
                </TableCell>
              </TableRow>
            )}
            {upcoming.map((appointment) => {
              const customer = customerById.get(appointment.customerId)
              const vehicle = vehicleById.get(appointment.vehicleId)
              const when = new Date(appointment.scheduledAt)
              return (
                <TableRow key={appointment.id}>
                  <TableCell className="font-medium">
                    {customer?.name ?? "Unknown"}
                  </TableCell>
                  <TableCell>
                    {appointmentTypeLabels[appointment.type]}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {dayLabel(when)}, {format(when, "h:mm a")}
                  </TableCell>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {vehicle
                        ? `${vehicle.make} ${vehicle.model} `
                        : "—"}
                    </span>
                    {vehicle && (
                      <span className="data-id text-foreground/80">
                        {vehicle.licensePlate}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <StatusBadge tone={appointmentStatusTones[appointment.status]}>
                      {appointmentStatusLabels[appointment.status]}
                    </StatusBadge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
