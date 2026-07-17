"use client"

import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getErrorMessage } from "@/lib/api"
import { appointmentTypeLabels } from "@/lib/format"
import { cn } from "@/lib/utils"
import { useAppDispatch } from "@/redux/hooks"
import {
  createAppointment,
  updateAppointment,
} from "@/redux/appointments/appointments-thunks"

const appointmentTypes = Object.keys(
  appointmentTypeLabels
) as AppointmentType[]

const durations = [15, 30, 45, 60, 90]

export function combineDateTime(date: Date, time: string): string {
  const [h, m] = time.split(":").map(Number)
  const d = new Date(date)
  d.setHours(h ?? 0, m ?? 0, 0, 0)
  return d.toISOString()
}

export function splitDateTime(iso: string): { date: Date; time: string } {
  const d = new Date(iso)
  const time = `${String(d.getHours()).padStart(2, "0")}:${String(
    d.getMinutes()
  ).padStart(2, "0")}`
  return { date: d, time }
}

type AppointmentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
  vehicles: Vehicle[]
  workOrders: WorkOrder[]
} & (
  | { mode: "book"; defaultDate?: Date; appointment?: never }
  | { mode: "reschedule"; appointment: Appointment; defaultDate?: never }
)

export function AppointmentDialog(props: AppointmentDialogProps) {
  const { open, onOpenChange } = props
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {props.mode === "book" ? (
          <BookForm {...props} />
        ) : (
          <RescheduleForm {...props} />
        )}
      </DialogContent>
    </Dialog>
  )
}

// ---- Book ------------------------------------------------------------------

const bookSchema = z.object({
  customerId: z.string().min(1, "Pick the customer"),
  vehicleId: z.string().min(1, "Pick the vehicle"),
  type: z.enum(appointmentTypes as [AppointmentType, ...AppointmentType[]]),
  workOrderId: z.string(),
  date: z.date(),
  time: z.string().min(1, "Pick a time"),
  durationMin: z.coerce.number<number>().min(5),
})

type BookValues = z.infer<typeof bookSchema>

function BookForm({
  onOpenChange,
  customers,
  vehicles,
  workOrders,
  defaultDate,
}: Extract<AppointmentDialogProps, { mode: "book" }>) {
  const dispatch = useAppDispatch()
  const form = useForm<BookValues>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      customerId: "",
      vehicleId: "",
      type: "drop_off",
      workOrderId: "",
      date: defaultDate ?? new Date(),
      time: "09:00",
      durationMin: 30,
    },
  })

  const customerId = form.watch("customerId")
  const customerVehicles = customerId
    ? vehicles.filter((v) => v.customerId === customerId)
    : vehicles

  const onSubmit = async (values: BookValues) => {
    try {
      await dispatch(
        createAppointment({
          customerId: values.customerId,
          vehicleId: values.vehicleId,
          workOrderId: values.workOrderId || null,
          type: values.type,
          scheduledAt: combineDateTime(values.date, values.time),
          durationMin: values.durationMin,
        })
      ).unwrap()
      toast.success("Appointment booked", {
        description: "It starts as pending — confirm it when the customer agrees.",
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not book appointment"))
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Book appointment</DialogTitle>
        <DialogDescription>Starts as pending confirmation.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customers.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {customerVehicles.map((v) => (
                        <SelectItem key={v.id} value={v.id}>
                          {v.make} {v.model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {appointmentTypes.map((t) => (
                        <SelectItem key={t} value={t}>
                          {appointmentTypeLabels[t]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="durationMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration</FormLabel>
                  <Select
                    onValueChange={(v) => field.onChange(Number(v))}
                    value={String(field.value)}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {durations.map((d) => (
                        <SelectItem key={d} value={String(d)}>
                          {d} min
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <DateTimeFields form={form} />
          <FormField
            control={form.control}
            name="workOrderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Link work order (optional)</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="None" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {workOrders.map((wo) => (
                      <SelectItem key={wo.id} value={wo.id}>
                        {wo.number} — {wo.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? "Booking…" : "Book appointment"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

// ---- Reschedule ------------------------------------------------------------

const rescheduleSchema = z.object({
  date: z.date(),
  time: z.string().min(1, "Pick a time"),
  durationMin: z.coerce.number<number>().min(5),
})

type RescheduleValues = z.infer<typeof rescheduleSchema>

function RescheduleForm({
  onOpenChange,
  appointment,
}: Extract<AppointmentDialogProps, { mode: "reschedule" }>) {
  const dispatch = useAppDispatch()
  const initial = splitDateTime(appointment.scheduledAt)
  const form = useForm<RescheduleValues>({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: {
      date: initial.date,
      time: initial.time,
      durationMin: appointment.durationMin,
    },
  })

  const onSubmit = async (values: RescheduleValues) => {
    try {
      await dispatch(
        updateAppointment({
          id: appointment.id,
          patch: {
            scheduledAt: combineDateTime(values.date, values.time),
            durationMin: values.durationMin,
          },
        })
      ).unwrap()
      toast.success("Appointment rescheduled")
      onOpenChange(false)
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not reschedule"))
    }
  }

  return (
    <>
      <DialogHeader>
        <DialogTitle>Reschedule appointment</DialogTitle>
        <DialogDescription>Pick a new date and time.</DialogDescription>
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <DateTimeFields form={form} />
          <FormField
            control={form.control}
            name="durationMin"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration</FormLabel>
                <Select
                  onValueChange={(v) => field.onChange(Number(v))}
                  value={String(field.value)}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {durations.map((d) => (
                      <SelectItem key={d} value={String(d)}>
                        {d} min
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="w-full"
            >
              {form.formState.isSubmitting ? "Saving…" : "Save new time"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </>
  )
}

// ---- Shared date + time fields --------------------------------------------

type DateTimeForm = {
  control: import("react-hook-form").Control<{ date: Date; time: string }>
}

function DateTimeFields<
  T extends { date: Date; time: string },
>({ form }: { form: import("react-hook-form").UseFormReturn<T> }) {
  // Cast to the shared shape: both schemas include `date` and `time`.
  const control = form.control as unknown as DateTimeForm["control"]
  return (
    <div className="grid grid-cols-2 gap-4">
      <FormField
        control={control}
        name="date"
        render={({ field }) => (
          <FormItem className="flex flex-col">
            <FormLabel>Date</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className={cn(
                      "justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 size-4" />
                    {field.value ? format(field.value, "MMM d") : "Pick"}
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={(d) => d && field.onChange(d)}
                />
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Time</FormLabel>
            <FormControl>
              <Input type="time" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  )
}
