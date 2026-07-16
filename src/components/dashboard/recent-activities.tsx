"use client"

import { formatDistanceToNow } from "date-fns"
import { StatusBadge, StatusTone } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { formatCurrency, initials } from "@/lib/format"

const statusMeta: Record<
  ActivityEntry["status"],
  { label: string; tone: StatusTone }
> = {
  complete: { label: "Complete", tone: "success" },
  pending: { label: "Pending", tone: "warning" },
  in_progress: { label: "In Progress", tone: "info" },
}

export type RecentActivitiesProps = {
  activity: ActivityEntry[]
  customers: Customer[]
  vehicles: Vehicle[]
}

export function RecentActivities({
  activity,
  customers,
  vehicles,
}: RecentActivitiesProps) {
  const customerById = new Map(customers.map((c) => [c.id, c]))
  const vehicleById = new Map(vehicles.map((v) => [v.id, v]))

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>Latest sales and services</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Value</TableHead>
              <TableHead className="text-right">When</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activity.map((entry) => {
              const customer = customerById.get(entry.customerId)
              const vehicle = vehicleById.get(entry.vehicleId)
              return (
                <TableRow key={entry.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <Avatar className="size-8">
                        <AvatarFallback className="text-xs">
                          {customer ? initials(customer.name) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">
                        {customer?.name ?? "Unknown"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {vehicle
                      ? `${vehicle.year} ${vehicle.make} ${vehicle.model}`
                      : "—"}
                  </TableCell>
                  <TableCell className="capitalize">{entry.type}</TableCell>
                  <TableCell>
                    <StatusBadge tone={statusMeta[entry.status].tone}>
                      {statusMeta[entry.status].label}
                    </StatusBadge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(entry.value)}
                  </TableCell>
                  <TableCell className="text-muted-foreground text-right">
                    {formatDistanceToNow(new Date(entry.at), {
                      addSuffix: true,
                    })}
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
