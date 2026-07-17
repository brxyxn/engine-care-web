# Appointments Flows Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make appointments interactive — book, confirm, reschedule, and cancel — for both owner (Service Dashboard) and mechanic (My Schedule), on top of the existing mock API.

**Architecture:** Add a `createAppointment` Redux thunk (confirm/reschedule/cancel reuse the existing `updateAppointment`). Build one `AppointmentDialog` (book + reschedule modes) and an `AppointmentAgendaRow` (per-appointment actions menu). Turn the shared `BookingCalendar` selected-day chips into an interactive agenda that both role screens already render, so both roles get the flows from one component.

**Tech Stack:** Next.js 16 App Router, TypeScript, Redux Toolkit, react-hook-form + zod, shadcn/ui (Dialog, DropdownMenu, AlertDialog, Popover, Calendar, Select, Form), sonner toasts, axios via `src/lib/api.ts`, date-fns.

## Global Constraints

- **No unit-test framework exists** (Jest is `[todo]` in README; no `*.test.*` files). Per-task verification is: `pnpm exec tsc --noEmit` (type-check) + `pnpm lint` (eslint) both clean. End-to-end behavior is verified in the final task with the **verify** skill (Playwright driving), not unit tests.
- **API envelope:** all endpoints return `{ success, data, error? }`; the `api` helper in `src/lib/api.ts` already unwraps it and throws `Error(envelope.error)` on failure. Use `getErrorMessage(err, fallback)` from `src/lib/api.ts` in catch blocks.
- **Money/labels/ids:** unchanged from Phase 1. IDs are opaque strings.
- **Thunk pattern:** dispatch with `.unwrap()` inside `try/catch`; success → `toast.success`, failure → `toast.error(getErrorMessage(...))`. Mirror `src/components/work-orders/create-work-order-dialog.tsx`.
- **No backend changes.** `POST /api/appointments` and `PATCH /api/appointments/:id` already exist and work in the Next mock.
- **Out of scope (do not build):** `completed`/`no_show` UI transitions, recurring appointments, drag-to-reschedule, Jest setup.

---

## File Structure

| File | Responsibility |
|---|---|
| `src/redux/appointments/appointments-thunks.ts` (modify) | Add `createAppointment` thunk |
| `src/redux/appointments/appointments-slice.ts` (modify) | Add `createAppointment.fulfilled` reducer |
| `src/lib/format.ts` (modify) | Add `appointmentStatusLabels` + `appointmentStatusTones` |
| `src/components/dashboard/upcoming-appointments.tsx` (modify) | Consume centralized status maps |
| `src/components/service/appointment-dialog.tsx` (create) | Book + reschedule dialog |
| `src/components/service/appointment-agenda-row.tsx` (create) | Agenda row + confirm/reschedule/cancel actions |
| `src/components/service/booking-calendar.tsx` (modify) | Agenda list, Book button, new props |
| `src/components/service/service-screen.tsx` (modify) | Pass new props (owner) |
| `src/components/mechanic/mechanic-schedule-screen.tsx` (modify) | Pass new props (mechanic) |

---

## Task 1: `createAppointment` thunk + reducer

**Files:**
- Modify: `src/redux/appointments/appointments-thunks.ts`
- Modify: `src/redux/appointments/appointments-slice.ts`

**Interfaces:**
- Consumes: `api.post` from `src/lib/api.ts`; `Appointment` ambient type.
- Produces: `createAppointment` thunk — arg `Omit<Appointment, "id" | "status">`, resolves `Appointment`. New appointment is prepended to `slice.state`.

- [ ] **Step 1: Add the thunk**

In `src/redux/appointments/appointments-thunks.ts`, add below `fetchAppointments` (keep existing imports; `api` and `createAsyncThunk` are already imported):

```ts
/** Book a new appointment. Server sets id + status: "pending". */
export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (input: Omit<Appointment, "id" | "status">) =>
    api.post<Appointment>("/appointments", input)
)
```

- [ ] **Step 2: Add the reducer case**

In `src/redux/appointments/appointments-slice.ts`, update the import from thunks to include `createAppointment`:

```ts
import {
  createAppointment,
  fetchAppointments,
  updateAppointment,
} from "@/redux/appointments/appointments-thunks"
```

Then add this case inside `extraReducers`, after the `updateAppointment.fulfilled` case:

```ts
.addCase(createAppointment.fulfilled, (slice, action) => {
  slice.state = [action.payload, ...(slice.state ?? [])]
})
```

- [ ] **Step 3: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Lint**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/redux/appointments/appointments-thunks.ts src/redux/appointments/appointments-slice.ts
git commit -m "feat: createAppointment thunk and reducer"
```

---

## Task 2: Centralize appointment status labels + tones

**Files:**
- Modify: `src/lib/format.ts`
- Modify: `src/components/dashboard/upcoming-appointments.tsx`

**Interfaces:**
- Consumes: `StatusTone` from `src/components/shared/status-badge.tsx` (values: `success | warning | info | destructive | accent | muted`); `AppointmentStatus` ambient type.
- Produces: `appointmentStatusLabels: Record<AppointmentStatus, string>` and `appointmentStatusTones: Record<AppointmentStatus, StatusTone>` exported from `src/lib/format.ts`.

- [ ] **Step 1: Add the maps to format.ts**

In `src/lib/format.ts`, add an import at the top (with the other imports):

```ts
import { StatusTone } from "@/components/shared/status-badge"
```

Then add, directly after the `appointmentTypeLabels` block:

```ts
export const appointmentStatusLabels: Record<AppointmentStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No-show",
}

export const appointmentStatusTones: Record<AppointmentStatus, StatusTone> = {
  pending: "warning",
  confirmed: "success",
  completed: "muted",
  cancelled: "destructive",
  no_show: "destructive",
}
```

- [ ] **Step 2: Consume them in `upcoming-appointments.tsx`**

In `src/components/dashboard/upcoming-appointments.tsx`:

Delete the local `statusTones` const (lines defining `const statusTones: Record<AppointmentStatus, StatusTone> = {...}`).

Update the format import to add the two new names:

```ts
import {
  appointmentStatusLabels,
  appointmentStatusTones,
  appointmentTypeLabels,
} from "@/lib/format"
```

Replace the status cell's badge (currently `tone={statusTones[appointment.status]}` with the inline `appointment.status === "pending" ? "Pending" : "Confirmed"` text) with:

```tsx
<StatusBadge tone={appointmentStatusTones[appointment.status]}>
  {appointmentStatusLabels[appointment.status]}
</StatusBadge>
```

If `StatusTone` is now unused in this file, remove it from the `status-badge` import (keep `StatusBadge`).

- [ ] **Step 3: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Lint**

Run: `pnpm lint`
Expected: no errors (no unused imports).

- [ ] **Step 5: Commit**

```bash
git add src/lib/format.ts src/components/dashboard/upcoming-appointments.tsx
git commit -m "refactor: centralize appointment status labels and tones"
```

---

## Task 3: `AppointmentDialog` (book + reschedule)

**Files:**
- Create: `src/components/service/appointment-dialog.tsx`

**Interfaces:**
- Consumes: `createAppointment`, `updateAppointment` thunks; `getErrorMessage` from `src/lib/api.ts`; `appointmentTypeLabels` from `src/lib/format.ts`; ambient `Appointment`, `AppointmentType`, `Customer`, `Vehicle`, `WorkOrder`.
- Produces: `AppointmentDialog` component and helpers `combineDateTime(date, time)`, `splitDateTime(iso)`. Props:
  ```ts
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
  ```

- [ ] **Step 1: Create the file with both forms**

Create `src/components/service/appointment-dialog.tsx`:

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors. If the `DateTimeFields` generic cast complains, the `as unknown as` cast is intentional — both `BookValues` and `RescheduleValues` structurally contain `date: Date` and `time: string`, so the shared field renderer is safe.

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/service/appointment-dialog.tsx
git commit -m "feat: appointment dialog (book + reschedule)"
```

---

## Task 4: `AppointmentAgendaRow` (row + actions)

**Files:**
- Create: `src/components/service/appointment-agenda-row.tsx`

**Interfaces:**
- Consumes: `updateAppointment` thunk; `getErrorMessage` from `src/lib/api.ts`; `appointmentTypeLabels`, `appointmentStatusLabels`, `appointmentStatusTones` from `src/lib/format.ts`; `StatusBadge`; DropdownMenu + AlertDialog primitives; ambient `Appointment`, `Customer`.
- Produces: `AppointmentAgendaRow` component. Props:
  ```ts
  type AppointmentAgendaRowProps = {
    appointment: Appointment
    customer?: Customer
    onReschedule: (appointment: Appointment) => void
  }
  ```
  Handles Confirm and Cancel internally (dispatch + toast; Cancel via AlertDialog). Bubbles Reschedule up via `onReschedule`.

- [ ] **Step 1: Create the file**

Create `src/components/service/appointment-agenda-row.tsx`:

```tsx
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
```

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors. (If `DropdownMenuItem` has no `variant` prop in this shadcn version, remove `variant="destructive"` and add `className="text-destructive"` instead.)

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/service/appointment-agenda-row.tsx
git commit -m "feat: appointment agenda row with confirm/reschedule/cancel"
```

---

## Task 5: Interactive `BookingCalendar` (agenda + Book button)

**Files:**
- Modify: `src/components/service/booking-calendar.tsx`

**Interfaces:**
- Consumes: `AppointmentDialog` (Task 3), `AppointmentAgendaRow` (Task 4); ambient `Customer`, `Vehicle`, `WorkOrder`.
- Produces: updated `BookingCalendar` with props `{ appointments, customers?, vehicles?, workOrders?, canBook? }`. New props are optional with defaults so existing callers still compile until Task 6 wires them.

- [ ] **Step 1: Rewrite the component**

Replace the entire contents of `src/components/service/booking-calendar.tsx` with:

```tsx
"use client"

import { useMemo, useState } from "react"
import { format, isSameDay } from "date-fns"
import { Plus } from "lucide-react"
import { AppointmentAgendaRow } from "@/components/service/appointment-agenda-row"
import { AppointmentDialog } from "@/components/service/appointment-dialog"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export type BookingCalendarProps = {
  appointments: Appointment[]
  customers?: Customer[]
  vehicles?: Vehicle[]
  workOrders?: WorkOrder[]
  canBook?: boolean
}

export function BookingCalendar({
  appointments,
  customers = [],
  vehicles = [],
  workOrders = [],
  canBook = false,
}: BookingCalendarProps) {
  const [selected, setSelected] = useState<Date>(() => new Date())
  const [bookOpen, setBookOpen] = useState(false)
  const [rescheduling, setRescheduling] = useState<Appointment | null>(null)

  const customerById = useMemo(
    () => new Map(customers.map((c) => [c.id, c])),
    [customers]
  )

  const daySlots = appointments
    .filter((a) => isSameDay(new Date(a.scheduledAt), selected))
    .sort(
      (a, b) =>
        new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
    )

  const bookedDays = appointments.map((a) => new Date(a.scheduledAt))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Calendar Booking</CardTitle>
        {canBook && (
          <Button size="sm" onClick={() => setBookOpen(true)}>
            <Plus className="size-4" />
            Book
          </Button>
        )}
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => date && setSelected(date)}
          modifiers={{ booked: bookedDays }}
          modifiersClassNames={{
            booked:
              "after:bg-primary relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full",
          }}
          className="mx-auto"
        />
        <div className="border-border/60 border-t pt-3">
          <p className="text-muted-foreground mb-2 text-sm">
            {format(selected, "EEEE, MMM d")} ·{" "}
            {daySlots.length === 0
              ? "no bookings"
              : `${daySlots.length} booked`}
          </p>
          <div className="flex flex-col gap-2">
            {daySlots.map((appointment) => (
              <AppointmentAgendaRow
                key={appointment.id}
                appointment={appointment}
                customer={customerById.get(appointment.customerId)}
                onReschedule={setRescheduling}
              />
            ))}
          </div>
        </div>
      </CardContent>

      {canBook && (
        <AppointmentDialog
          mode="book"
          open={bookOpen}
          onOpenChange={setBookOpen}
          customers={customers}
          vehicles={vehicles}
          workOrders={workOrders}
          defaultDate={selected}
        />
      )}
      {rescheduling && (
        <AppointmentDialog
          mode="reschedule"
          appointment={rescheduling}
          open={rescheduling !== null}
          onOpenChange={(open) => !open && setRescheduling(null)}
          customers={customers}
          vehicles={vehicles}
          workOrders={workOrders}
        />
      )}
    </Card>
  )
}
```

- [ ] **Step 2: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors. Existing callers (`service-screen.tsx`, `mechanic-schedule-screen.tsx`) still pass only `appointments`, which is valid because the new props are optional.

- [ ] **Step 3: Lint**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add src/components/service/booking-calendar.tsx
git commit -m "feat: interactive booking calendar agenda"
```

---

## Task 6: Wire owner + mechanic screens

**Files:**
- Modify: `src/components/service/service-screen.tsx`
- Modify: `src/components/mechanic/mechanic-schedule-screen.tsx`

**Interfaces:**
- Consumes: `BookingCalendar` props from Task 5.

- [ ] **Step 1: Owner Service screen**

In `src/components/service/service-screen.tsx`, replace the `<BookingCalendar appointments={appointments ?? []} />` usage (inside the `lg:grid-cols-[380px_1fr]` grid) with:

```tsx
<BookingCalendar
  appointments={appointments ?? []}
  customers={customers ?? []}
  vehicles={vehicles ?? []}
  workOrders={workOrders ?? []}
  canBook
/>
```

(`customers`, `vehicles`, `workOrders` are already destructured from hooks in this file — no new imports needed.)

- [ ] **Step 2: Mechanic My Schedule screen**

In `src/components/mechanic/mechanic-schedule-screen.tsx`, replace `<BookingCalendar appointments={myAppointments} />` with:

```tsx
<BookingCalendar
  appointments={myAppointments}
  customers={customers ?? []}
  vehicles={vehicles ?? []}
  workOrders={mine}
  canBook
/>
```

(`customers`, `vehicles`, and `mine` already exist in this file — `mine` is the mechanic's own work orders.)

- [ ] **Step 3: Type-check**

Run: `pnpm exec tsc --noEmit`
Expected: no errors.

- [ ] **Step 4: Lint**

Run: `pnpm lint`
Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/components/service/service-screen.tsx src/components/mechanic/mechanic-schedule-screen.tsx
git commit -m "feat: wire appointment flows into owner and mechanic screens"
```

---

## Task 7: End-to-end verification (verify skill)

**Files:** none (verification only).

- [ ] **Step 1: Launch and drive with the verify skill**

Follow `.claude/skills/verify/SKILL.md`:

```bash
PORT=3100 pnpm dev
```

Install Playwright in a scratch dir and script an interactive session (dialogs need a real browser, not static screenshots).

- [ ] **Step 2: Owner flow**

Log in as owner (`ray@enginecare.app` / `engine123`). Go to Service Dashboard:
1. Click **Book** on the Calendar Booking card → dialog opens with today's date prefilled.
2. Pick a customer, its vehicle, a type, time, duration → submit. Toast "Appointment booked". A new dot/agenda row appears on the selected day.
3. On the new pending row, open the `⋯` menu → **Confirm**. Badge flips to Confirmed, toast fires.
4. `⋯` → **Reschedule** → change the time → save. Row time updates, toast fires.
5. `⋯` → **Cancel** → confirm in the AlertDialog. Badge → Cancelled, actions menu disappears, toast fires.

Screenshot each step to the scratchpad.

- [ ] **Step 3: Mechanic flow**

Log in as mechanic (`sarah@enginecare.app` / `engine123`). Go to My Schedule. Confirm the agenda shows the mechanic's own appointments and that Confirm / Reschedule / Cancel work on one of them.

- [ ] **Step 4: Report**

Confirm type-check + lint are clean and paste the verification screenshots/observations. If any step fails, fix inline (do not mark the task complete with a failing step), re-run, then commit any fixes:

```bash
git add -A
git commit -m "fix: appointment flow issues found in verification"
```

---

## Self-Review Notes

- **Spec coverage:** Book (Task 3 book form + Task 1 thunk), Confirm (Task 4), Reschedule (Task 3 reschedule form + Task 4 trigger + Task 5 wiring), Cancel (Task 4 AlertDialog). Owner wiring + mechanic wiring (Task 6). Centralized status labels + `UpcomingAppointments` refactor (Task 2). Verification via verify skill (Task 7). All spec sections map to a task.
- **No backend task** — correct; the mock endpoints already exist (spec §"Existing state").
- **Type consistency:** `createAppointment` arg `Omit<Appointment,"id"|"status">` (Task 1) matches the object built in the book form (Task 3). `updateAppointment({ id, patch })` shape (Tasks 3, 4) matches the existing thunk signature. `AppointmentAgendaRow` `onReschedule: (appointment) => void` (Task 4) matches `setRescheduling` usage (Task 5). `appointmentStatusTones`/`appointmentStatusLabels` names consistent across Tasks 2, 4.
- **Optional-props sequencing:** Task 5 makes new `BookingCalendar` props optional so the tree stays green before Task 6 supplies them.
