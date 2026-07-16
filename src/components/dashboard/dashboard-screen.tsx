"use client"

import { AutomatedReminders } from "@/components/dashboard/automated-reminders"
import { BookingsChart } from "@/components/dashboard/bookings-chart"
import { RecentActivities } from "@/components/dashboard/recent-activities"
import { ServiceRequests } from "@/components/dashboard/service-requests"
import { UpcomingAppointments } from "@/components/dashboard/upcoming-appointments"
import { KpiCard } from "@/components/shared/kpi-card"
import { PageHeader } from "@/components/shared/page-header"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useAppointments,
  useCustomers,
  useDashboard,
  useReminders,
  useVehicles,
} from "@/hooks/use-data"
import { formatCompactCurrency } from "@/lib/format"
import { CalendarRange, Car, Download, UsersRound, Wrench } from "lucide-react"

const downloadActivityCsv = (
  activity: ActivityEntry[],
  customers: Customer[]
) => {
  const customerById = new Map(customers.map((c) => [c.id, c]))
  const rows = [
    ["customer", "type", "status", "value", "at"],
    ...activity.map((entry) => [
      customerById.get(entry.customerId)?.name ?? entry.customerId,
      entry.type,
      entry.status,
      String(entry.value),
      entry.at,
    ]),
  ]
  const csv = rows.map((row) => row.join(",")).join("\n")
  const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
  const link = document.createElement("a")
  link.href = url
  link.download = "enginecare-recent-activity.csv"
  link.click()
  URL.revokeObjectURL(url)
}

export function DashboardScreen() {
  const { stats, activity } = useDashboard()
  const { customers } = useCustomers()
  const { vehicles } = useVehicles()
  const { appointments } = useAppointments()
  const { reminders } = useReminders()

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Dashboard Overview"
        description="Centralized view of your shop"
        actions={
          <>
            <Badge variant="outline" className="gap-1.5 rounded-full px-3 py-1.5">
              <CalendarRange className="size-3.5" />
              This month
            </Badge>
            <Button
              variant="secondary"
              onClick={() => downloadActivityCsv(activity, customers ?? [])}
            >
              <Download />
              Export report
            </Button>
          </>
        }
      />

      {stats ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <KpiCard
            icon={<Wrench />}
            label="Vehicles in Service"
            value={String(stats.vehiclesInService.value)}
            badge={`+${stats.vehiclesInService.delta.amount} ${stats.vehiclesInService.delta.label}`}
            badgeTone="positive"
          />
          <KpiCard
            icon={<UsersRound />}
            label="Active Customers"
            value={String(stats.activeCustomers.value)}
            badge={`+${stats.activeCustomers.delta.amount} ${stats.activeCustomers.delta.label}`}
            badgeTone="positive"
          />
          <KpiCard
            icon={<Car />}
            label="Monthly Revenue"
            value={formatCompactCurrency(stats.monthlyRevenue.value)}
            badge={`+${formatCompactCurrency(stats.monthlyRevenue.delta.amount)} ${stats.monthlyRevenue.delta.label}`}
            badgeTone="positive"
          />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {stats ? (
            <BookingsChart data={stats.bookings} />
          ) : (
            <Skeleton className="h-80 rounded-xl" />
          )}
        </div>
        {stats ? (
          <ServiceRequests data={stats.serviceRequests} />
        ) : (
          <Skeleton className="h-80 rounded-xl" />
        )}
      </div>

      <RecentActivities
        activity={activity}
        customers={customers ?? []}
        vehicles={vehicles ?? []}
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <AutomatedReminders reminders={reminders} />
        <div className="lg:col-span-2">
          <UpcomingAppointments
            appointments={appointments ?? []}
            customers={customers ?? []}
            vehicles={vehicles ?? []}
          />
        </div>
      </div>
    </div>
  )
}
