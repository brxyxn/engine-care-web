"use client"

import { useState } from "react"
import { format } from "date-fns"
import { MoreVertical } from "lucide-react"
import { toast } from "sonner"
import { StatusBadge } from "@/components/shared/status-badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getErrorMessage } from "@/lib/api"
import {
  appointmentStatusLabels,
  appointmentStatusTones,
  appointmentTypeLabels,
} from "@/lib/format"
import { useAppDispatch } from "@/redux/hooks"
import { updateAppointment } from "@/redux/appointments/appointments-thunks"

export type AppointmentAgendaRowProps = {
  appointment: Appointment
  customer?: Customer
  onReschedule: (appointment: Appointment) => void
}

export function AppointmentAgendaRow({
  appointment,
  customer,
  onReschedule,
}: AppointmentAgendaRowProps) {
  const dispatch = useAppDispatch()
  const [cancelOpen, setCancelOpen] = useState(false)

  const isPending = appointment.status === "pending"
  const isActionable = isPending || appointment.status === "confirmed"

  const confirm = async () => {
    try {
      await dispatch(
        updateAppointment({
          id: appointment.id,
          patch: { status: "confirmed" },
        })
      ).unwrap()
      toast.success("Appointment confirmed")
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not confirm"))
    }
  }

  const cancel = async () => {
    try {
      await dispatch(
        updateAppointment({
          id: appointment.id,
          patch: { status: "cancelled" },
        })
      ).unwrap()
      toast.success("Appointment cancelled")
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not cancel"))
    }
    setCancelOpen(false)
  }

  return (
    <div className="border-border/60 flex items-center gap-3 rounded-lg border px-3 py-2">
      <span className="text-foreground w-16 shrink-0 text-sm font-medium tabular-nums">
        {format(new Date(appointment.scheduledAt), "h:mm a")}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium">
          {customer?.name ?? "Unknown"}
        </p>
        <p className="text-muted-foreground truncate text-xs">
          {appointmentTypeLabels[appointment.type]} · {appointment.durationMin}{" "}
          min
        </p>
      </div>
      <StatusBadge tone={appointmentStatusTones[appointment.status]}>
        {appointmentStatusLabels[appointment.status]}
      </StatusBadge>
      {isActionable && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8 shrink-0">
              <MoreVertical className="size-4" />
              <span className="sr-only">Appointment actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {isPending && (
              <DropdownMenuItem onSelect={confirm}>Confirm</DropdownMenuItem>
            )}
            <DropdownMenuItem onSelect={() => onReschedule(appointment)}>
              Reschedule
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onSelect={() => setCancelOpen(true)}
            >
              Cancel
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      <AlertDialog open={cancelOpen} onOpenChange={setCancelOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
            <AlertDialogDescription>
              {customer?.name ?? "The customer"} will need to rebook. This can’t
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep it</AlertDialogCancel>
            <AlertDialogAction onClick={cancel}>
              Cancel appointment
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
