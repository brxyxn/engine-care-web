"use client"

import { useState } from "react"
import { AddCustomerDialog } from "@/components/customers/add-customer-dialog"
import { CustomerDetailPanel } from "@/components/customers/customer-detail-panel"
import {
  CustomerFilter,
  CustomerFilters,
} from "@/components/customers/customer-filters"
import { CustomerTable } from "@/components/customers/customer-table"
import { PageHeader } from "@/components/shared/page-header"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  useAppointments,
  useCustomers,
  useVehicles,
  useWorkOrders,
} from "@/hooks/use-data"

export function CustomersScreen() {
  const { customers } = useCustomers()
  const { vehicles } = useVehicles()
  const { appointments } = useAppointments()
  const { workOrders } = useWorkOrders()

  const [filter, setFilter] = useState<CustomerFilter>("all")
  const [selectedId, setSelectedId] = useState<string | null>(null)

  if (!customers) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Customer List" />
        <Skeleton className="h-10 w-2/3 rounded-full" />
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  const filtered =
    filter === "all"
      ? customers
      : customers.filter((customer) => customer.status === filter)

  const selected =
    customers.find((customer) => customer.id === selectedId) ??
    filtered[0] ??
    null

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Customer List"
        description="Everyone your shop works with"
        actions={<AddCustomerDialog />}
      />

      <CustomerFilters
        customers={customers}
        value={filter}
        onChange={setFilter}
      />

      <div className="grid items-start gap-4 xl:grid-cols-[1fr_360px]">
        <Card>
          <CardContent>
            <CustomerTable
              customers={filtered}
              vehicles={vehicles ?? []}
              selectedId={selected?.id ?? null}
              onSelect={setSelectedId}
            />
          </CardContent>
        </Card>

        {selected && (
          <CustomerDetailPanel
            customer={selected}
            vehicles={vehicles ?? []}
            appointments={appointments ?? []}
            workOrders={workOrders ?? []}
          />
        )}
      </div>
    </div>
  )
}
