"use client"

import { useState } from "react"
import { format, formatDistanceToNow } from "date-fns"
import { StatusBadge } from "@/components/shared/status-badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  appointmentTypeLabels,
  formatCurrency,
  initials,
  interactionTypeLabels,
} from "@/lib/format"
import { useAppDispatch } from "@/redux/hooks"
import { updateAppointment } from "@/redux/appointments/appointments-thunks"
import { Car, Mail, MapPin, Phone } from "lucide-react"
import { toast } from "sonner"

export type CustomerDetailPanelProps = {
  customer: Customer
  vehicles: Vehicle[]
  appointments: Appointment[]
  workOrders: WorkOrder[]
}

export function CustomerDetailPanel({
  customer,
  vehicles,
  appointments,
  workOrders,
}: CustomerDetailPanelProps) {
  const dispatch = useAppDispatch()
  const [rescheduleFor, setRescheduleFor] = useState<Appointment | null>(null)
  const [newTime, setNewTime] = useState("")

  const ownedVehicles = vehicles.filter((v) => v.customerId === customer.id)
  const vehicleById = new Map(vehicles.map((v) => [v.id, v]))
  const pendingAppointments = appointments.filter(
    (a) => a.customerId === customer.id && a.status === "pending"
  )
  const customerOrders = workOrders
    .filter((wo) => wo.customerId === customer.id)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

  const confirmAppointment = async (appointment: Appointment) => {
    await dispatch(
      updateAppointment({
        id: appointment.id,
        patch: { status: "confirmed" },
      })
    )
    toast.success("Appointment confirmed", {
      description: `${customer.name} will get an automatic confirmation.`,
    })
  }

  const reschedule = async () => {
    if (!rescheduleFor || !newTime) return
    await dispatch(
      updateAppointment({
        id: rescheduleFor.id,
        patch: { scheduledAt: new Date(newTime).toISOString() },
      })
    )
    toast.success("Appointment rescheduled", {
      description: `${customer.name} will be notified automatically.`,
    })
    setRescheduleFor(null)
    setNewTime("")
  }

  return (
    <Card className="h-fit">
      <CardHeader className="items-center text-center">
        <Avatar className="mx-auto size-16">
          <AvatarFallback className="text-lg">
            {initials(customer.name)}
          </AvatarFallback>
        </Avatar>
        <h2 className="mt-2 text-lg font-semibold">{customer.name}</h2>
        <p className="text-muted-foreground text-sm">{customer.location}</p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="profile">
          <TabsList className="w-full">
            <TabsTrigger value="profile" className="flex-1">
              Profile
            </TabsTrigger>
            <TabsTrigger value="activity" className="flex-1">
              Activity
            </TabsTrigger>
            <TabsTrigger value="history" className="flex-1">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="mt-4 flex flex-col gap-3">
            <ContactRow icon={<Mail />} label="Email" value={customer.email} />
            <ContactRow icon={<Phone />} label="Phone" value={customer.phone} />
            <ContactRow
              icon={<MapPin />}
              label="Location"
              value={customer.location}
            />
            <div className="mt-2">
              <h3 className="mb-2 text-sm font-medium">Vehicles</h3>
              {ownedVehicles.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No vehicles on file yet.
                </p>
              )}
              <div className="flex flex-col gap-2">
                {ownedVehicles.map((vehicle) => (
                  <div
                    key={vehicle.id}
                    className="bg-muted/40 flex items-center gap-3 rounded-xl p-3"
                  >
                    <span className="bg-primary/12 text-primary flex size-8 items-center justify-center rounded-lg">
                      <Car className="size-4" />
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {vehicle.year} {vehicle.make} {vehicle.model}
                      </span>
                      <span className="data-id text-muted-foreground">
                        {vehicle.licensePlate} · {vehicle.vin.slice(0, 8)}…
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="activity" className="mt-4">
            {customer.lastInteraction ? (
              <div className="bg-muted/40 rounded-xl p-3 text-sm">
                <p className="font-medium">
                  {interactionTypeLabels[customer.lastInteraction.type]}
                </p>
                <p className="text-muted-foreground text-xs">
                  {formatDistanceToNow(
                    new Date(customer.lastInteraction.at),
                    { addSuffix: true }
                  )}
                </p>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">No activity yet.</p>
            )}
          </TabsContent>

          <TabsContent value="history" className="mt-4 flex flex-col gap-2">
            {customerOrders.length === 0 && (
              <p className="text-muted-foreground text-sm">
                No work orders yet.
              </p>
            )}
            {customerOrders.map((order) => (
              <div
                key={order.id}
                className="bg-muted/40 flex items-center justify-between rounded-xl p-3"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{order.title}</span>
                  <span className="data-id text-muted-foreground">
                    {order.number}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(order.estimateTotal)}
                </span>
              </div>
            ))}
          </TabsContent>
        </Tabs>

        {pendingAppointments.length > 0 && (
          <div className="mt-5">
            <h3 className="mb-2 text-sm font-medium">Pending requests</h3>
            <div className="flex flex-col gap-2">
              {pendingAppointments.map((appointment) => {
                const vehicle = vehicleById.get(appointment.vehicleId)
                return (
                  <div
                    key={appointment.id}
                    className="border-border/70 flex flex-col gap-2 rounded-xl border p-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">
                        {appointmentTypeLabels[appointment.type]}
                        {vehicle ? ` — ${vehicle.make} ${vehicle.model}` : ""}
                      </span>
                      <StatusBadge tone="warning">Pending</StatusBadge>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      {format(
                        new Date(appointment.scheduledAt),
                        "EEE, MMM d 'at' h:mm a"
                      )}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => confirmAppointment(appointment)}
                      >
                        Confirm
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => setRescheduleFor(appointment)}
                      >
                        Reschedule
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </CardContent>

      <Dialog
        open={rescheduleFor !== null}
        onOpenChange={(open) => !open && setRescheduleFor(null)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Reschedule appointment</DialogTitle>
          </DialogHeader>
          <Input
            type="datetime-local"
            value={newTime}
            onChange={(event) => setNewTime(event.target.value)}
          />
          <DialogFooter>
            <Button variant="secondary" onClick={() => setRescheduleFor(null)}>
              Cancel
            </Button>
            <Button onClick={reschedule} disabled={!newTime}>
              Save new time
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

function ContactRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="bg-muted/40 flex items-center gap-3 rounded-xl p-3">
      <span className="bg-primary/12 text-primary flex size-8 shrink-0 items-center justify-center rounded-lg [&_svg]:size-4">
        {icon}
      </span>
      <div className="flex min-w-0 flex-col">
        <span className="text-muted-foreground text-xs">{label}</span>
        <span className="truncate text-sm font-medium">{value}</span>
      </div>
    </div>
  )
}
