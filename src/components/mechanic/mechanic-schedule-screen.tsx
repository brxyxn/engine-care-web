"use client"

import { BookingCalendar } from "@/components/service/booking-calendar"
import { TicketsTable } from "@/components/service/tickets-table"
import { PageHeader } from "@/components/shared/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useAppointments,
  useCustomers,
  useInvoices,
  useVehicles,
  useWorkOrders,
} from "@/hooks/use-data"
import { useAppSelector } from "@/redux/hooks"
import { selectSession } from "@/redux/session/session-slice"

export function MechanicScheduleScreen() {
  const session = useAppSelector(selectSession)
  const { workOrders } = useWorkOrders()
  const { appointments } = useAppointments()
  const { customers } = useCustomers()
  const { vehicles } = useVehicles()
  const { invoices } = useInvoices()

  if (!workOrders || !session) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="My Schedule" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  const mine = workOrders.filter(
    (wo) => wo.assignedMechanicId === session.user.id
  )
  const myOrderIds = new Set(mine.map((wo) => wo.id))
  const myAppointments = (appointments ?? []).filter(
    (a) => a.workOrderId !== null && myOrderIds.has(a.workOrderId)
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="My Schedule"
        description="Your bookings and today's tickets"
      />
      <div className="grid items-start gap-4 lg:grid-cols-[380px_1fr]">
        <BookingCalendar appointments={myAppointments} />
        <TicketsTable
          workOrders={mine}
          customers={customers ?? []}
          vehicles={vehicles ?? []}
          invoices={invoices ?? []}
        />
      </div>
    </div>
  )
}
