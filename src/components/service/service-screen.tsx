"use client"

import { BookingCalendar } from "@/components/service/booking-calendar"
import { MechanicWorkload } from "@/components/service/mechanic-workload"
import { PaymentStatus } from "@/components/service/payment-status"
import { RemindersCard } from "@/components/service/reminders-card"
import { RepairStatusBoard } from "@/components/service/repair-status-board"
import { TicketsTable } from "@/components/service/tickets-table"
import { KpiCard } from "@/components/shared/kpi-card"
import { PageHeader } from "@/components/shared/page-header"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useAppointments,
  useCustomers,
  useDashboard,
  useInvoices,
  useReminders,
  useStaff,
  useVehicles,
  useWorkOrders,
} from "@/hooks/use-data"
import { formatCompactCurrency } from "@/lib/format"
import { CalendarCheck, CircleCheck, DollarSign, Wrench } from "lucide-react"

export function ServiceScreen() {
  const { serviceStats } = useDashboard()
  const { appointments } = useAppointments()
  const { workOrders } = useWorkOrders()
  const { customers } = useCustomers()
  const { vehicles } = useVehicles()
  const { staff } = useStaff()
  const { invoices } = useInvoices()
  const { reminders } = useReminders()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Service Dashboard"
        description="Today on the shop floor"
      />

      {serviceStats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            icon={<CalendarCheck />}
            label="Appointments Today"
            value={String(serviceStats.appointmentsToday.value)}
            badge={`+${serviceStats.appointmentsToday.delta.amount} ${serviceStats.appointmentsToday.delta.label}`}
            badgeTone="positive"
          />
          <KpiCard
            icon={<DollarSign />}
            label="Service Revenue"
            value={formatCompactCurrency(serviceStats.serviceRevenue.value)}
            badge={serviceStats.serviceRevenue.delta.label}
          />
          <KpiCard
            icon={<CircleCheck />}
            label="Completed Services"
            value={String(serviceStats.completedServices.value)}
            badge={serviceStats.completedServices.delta.label}
            badgeTone="positive"
          />
          <KpiCard
            icon={<Wrench />}
            label="Pending Repairs"
            value={String(serviceStats.pendingRepairs.value)}
            badge={`${serviceStats.pendingRepairs.delta.amount} ${serviceStats.pendingRepairs.delta.label}`}
            badgeTone="negative"
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-[380px_1fr]">
        <BookingCalendar appointments={appointments ?? []} />
        <RepairStatusBoard
          workOrders={workOrders ?? []}
          vehicles={vehicles ?? []}
        />
      </div>

      <TicketsTable
        workOrders={workOrders ?? []}
        customers={customers ?? []}
        vehicles={vehicles ?? []}
        invoices={invoices ?? []}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <MechanicWorkload staff={staff ?? []} />
        {serviceStats && <PaymentStatus payments={serviceStats.payments} />}
        <RemindersCard reminders={reminders} customers={customers ?? []} />
      </div>
    </div>
  )
}
