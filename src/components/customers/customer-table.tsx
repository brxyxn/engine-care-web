"use client"

import { formatDistanceToNow } from "date-fns"
import { StatusBadge, StatusTone } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  customerStatusLabels,
  formatCurrency,
  initials,
  interactionTypeLabels,
} from "@/lib/format"
import { cn } from "@/lib/utils"

const statusTones: Record<CustomerStatus, StatusTone> = {
  new: "info",
  follow_up: "warning",
  active: "success",
  archived: "muted",
}

export type CustomerTableProps = {
  customers: Customer[]
  vehicles: Vehicle[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function CustomerTable({
  customers,
  vehicles,
  selectedId,
  onSelect,
}: CustomerTableProps) {
  const vehicleById = new Map(vehicles.map((v) => [v.id, v]))

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Last interaction</TableHead>
          <TableHead className="text-right">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {customers.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={4}
              className="text-muted-foreground py-10 text-center"
            >
              No customers match this filter.
            </TableCell>
          </TableRow>
        )}
        {customers.map((customer) => {
          const firstVehicle = customer.vehicleIds
            .map((id) => vehicleById.get(id))
            .find(Boolean)
          return (
            <TableRow
              key={customer.id}
              onClick={() => onSelect(customer.id)}
              data-state={selectedId === customer.id ? "selected" : undefined}
              className={cn(
                "cursor-pointer",
                selectedId === customer.id && "bg-muted/60"
              )}
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="size-9">
                    <AvatarFallback className="text-xs">
                      {initials(customer.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{customer.name}</span>
                    <span className="text-muted-foreground text-xs">
                      {customer.email}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge tone={statusTones[customer.status]}>
                  {customerStatusLabels[customer.status]}
                </StatusBadge>
              </TableCell>
              <TableCell>
                {customer.lastInteraction ? (
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {interactionTypeLabels[customer.lastInteraction.type]}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {formatDistanceToNow(
                        new Date(customer.lastInteraction.at),
                        { addSuffix: true }
                      )}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex flex-col items-end">
                  <span className="font-medium">
                    {formatCurrency(customer.lifetimeValue)}
                  </span>
                  <span className="text-muted-foreground text-xs">
                    {firstVehicle
                      ? `${firstVehicle.make} ${firstVehicle.model}`
                      : "No vehicle yet"}
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}
