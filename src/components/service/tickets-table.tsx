"use client"

import { format, isToday } from "date-fns"
import { StatusBadge, StatusTone } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
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
import { formatCurrency, initials, serviceTypeLabels } from "@/lib/format"

const ticketStatus = (
  status: WorkOrderStatus
): { label: string; tone: StatusTone } => {
  switch (status) {
    case "intake":
      return { label: "Pending", tone: "muted" }
    case "ready":
      return { label: "Ready", tone: "success" }
    case "delivered":
      return { label: "Delivered", tone: "muted" }
    default:
      return { label: "In Progress", tone: "warning" }
  }
}

export type TicketsTableProps = {
  workOrders: WorkOrder[]
  customers: Customer[]
  vehicles: Vehicle[]
  invoices: Invoice[]
}

export function TicketsTable({
  workOrders,
  customers,
  vehicles,
  invoices,
}: TicketsTableProps) {
  const customerById = new Map(customers.map((c) => [c.id, c]))
  const vehicleById = new Map(vehicles.map((v) => [v.id, v]))
  const invoiceByOrder = new Map(invoices.map((i) => [i.workOrderId, i]))

  const tickets = workOrders
    .filter(
      (wo) =>
        wo.status !== "delivered" &&
        wo.scheduledAt !== null &&
        isToday(new Date(wo.scheduledAt))
    )
    .sort(
      (a, b) =>
        new Date(a.scheduledAt!).getTime() -
        new Date(b.scheduledAt!).getTime()
    )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Service Appointments &amp; Active Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer &amp; vehicle</TableHead>
              <TableHead>Service type</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Invoicing</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tickets.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-muted-foreground py-8 text-center"
                >
                  No tickets scheduled for today.
                </TableCell>
              </TableRow>
            )}
            {tickets.map((ticket) => {
              const customer = customerById.get(ticket.customerId)
              const vehicle = vehicleById.get(ticket.vehicleId)
              const invoice = invoiceByOrder.get(ticket.id)
              const status = ticketStatus(ticket.status)
              return (
                <TableRow key={ticket.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">
                          {customer ? initials(customer.name) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {customer?.name ?? "Unknown"}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {vehicle
                            ? `${vehicle.make} ${vehicle.model} `
                            : "—"}
                          {vehicle && (
                            <span className="data-id">
                              ({vehicle.licensePlate})
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {serviceTypeLabels[ticket.serviceType]}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    Today, {format(new Date(ticket.scheduledAt!), "h:mm a")}
                  </TableCell>
                  <TableCell>
                    <StatusBadge tone={status.tone}>
                      {status.label}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-right">
                    {invoice ? (
                      invoice.status === "paid" ? (
                        <span className="text-success font-medium">Paid</span>
                      ) : (
                        <span className="font-medium">
                          {formatCurrency(invoice.amount)}{" "}
                          <span className="text-muted-foreground font-normal">
                            due
                          </span>
                        </span>
                      )
                    ) : (
                      <span className="text-muted-foreground">
                        {formatCurrency(ticket.estimateTotal)} est.
                      </span>
                    )}
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
