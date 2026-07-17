# Appointments Flows — Design

**Date:** 2026-07-17
**Status:** Approved (brainstorming) — ready for implementation planning

## Goal

Make appointments interactive. Today the UI only *displays* appointments
(`BookingCalendar`, `UpcomingAppointments`); the mock API already supports the
full lifecycle. This phase adds the four flows on top of the existing endpoints:

1. **Book** (create) a new appointment.
2. **Confirm** a pending appointment.
3. **Reschedule** an appointment (date / time / duration).
4. **Cancel** an appointment.

Both **owner** (Service Dashboard) and **mechanic** (My Schedule) can use these
flows. Mechanics act on their own appointments; the mechanic screen already
filters to those.

## Non-goals (YAGNI)

- No `completed` / `no_show` UI transitions.
- No recurring appointments.
- No drag-to-reschedule on the calendar grid.
- No backend changes — `POST /api/appointments` and
  `PATCH /api/appointments/:id` already exist and work.
- `UpcomingAppointments` (dashboard) stays read-only.

## Existing state (verified)

- **Type** `src/types/appointment.d.ts` — complete, unchanged:
  `{ id, customerId, vehicleId, workOrderId, type, scheduledAt, durationMin, status }`.
  - `type`: `drop_off | pickup | inspection | service`
  - `status`: `pending | confirmed | completed | cancelled | no_show`
- **API** — `POST /api/appointments` (body = `Appointment` minus `id`/`status`;
  creates with `status: "pending"`) and `PATCH /api/appointments/:id`
  (partial patch; used for confirm/reschedule/cancel). Both implemented in the
  Next mock and documented in `docs/api-contract.md`.
- **Redux** `src/redux/appointments/` — `fetchAppointments` and
  `updateAppointment` thunks exist; `updateAppointment.fulfilled` already maps
  the updated appointment into `slice.state`. **No `createAppointment` thunk
  yet.**
- **UI** — `BookingCalendar` (shared by owner Service + mechanic My Schedule)
  shows a calendar with dots on booked days and time chips for the selected day.
  `UpcomingAppointments` is a read-only table on the owner Dashboard. Neither has
  actions. `BookingCalendar`'s empty copy already says "Book one from the Service
  page," implying a booking entry point that does not exist yet.

## Conventions to match

- Create/edit via shadcn `Dialog` + `react-hook-form` + `zod` + `sonner` toast,
  exactly like `src/components/work-orders/create-work-order-dialog.tsx`.
- Thunks dispatched with `.unwrap()`; the `api` helper surfaces server error
  messages (see the work-order edit fix in commit `aa675d9`).
- Customer → vehicle dependent select: vehicles filtered by chosen `customerId`
  (same `form.watch("customerId")` pattern as create-work-order).
- `PageHeader` accepts an `actions` ReactNode; the create-button pattern
  (`useState` open flag + `<Button onClick>` + dialog at bottom) mirrors
  `work-orders-screen.tsx`.

## Design

### 1. Redux — add create

`src/redux/appointments/appointments-thunks.ts`

```ts
export const createAppointment = createAsyncThunk(
  "appointments/create",
  async (input: Omit<Appointment, "id" | "status">) =>
    api.post<Appointment>("/appointments", input)
)
```

`src/redux/appointments/appointments-slice.ts` — add:

```ts
.addCase(createAppointment.fulfilled, (slice, action) => {
  slice.state = [action.payload, ...(slice.state ?? [])]
})
```

`updateAppointment` is reused unchanged for confirm / reschedule / cancel.

### 2. Format helpers

`src/lib/format.ts` — centralize appointment status presentation (currently
inlined in `upcoming-appointments.tsx`):

- `appointmentStatusLabels: Record<AppointmentStatus, string>`
- `appointmentStatusTones: Record<AppointmentStatus, StatusTone>` (or keep the
  tone map beside `StatusBadge` if that reads cleaner). `upcoming-appointments.tsx`
  is refactored to consume these instead of its local maps.

### 3. `AppointmentDialog` — book + reschedule

New: `src/components/service/appointment-dialog.tsx`. One controlled dialog,
two modes via a discriminated prop:

- `mode: "book"` — full form:
  - `customerId` (Select), `vehicleId` (Select, filtered by customer)
  - `type` (Select over `appointmentTypeLabels`)
  - `date` (shadcn `Calendar` inside a `Popover`)
  - `time` (input `type="time"` or select of slots)
  - `durationMin` (Select: 15 / 30 / 45 / 60 / 90 min)
  - `workOrderId` (optional Select; may be empty → `null`)
  - Combines `date` + `time` into an ISO `scheduledAt`, dispatches
    `createAppointment`. Toast: "Appointment booked — pending confirmation."
  - Optional `defaultDate` prop so the caller can prefill the calendar's
    selected day.
- `mode: "reschedule"` — takes an `appointment`; only `date` / `time` /
  `durationMin`, prefilled. Dispatches
  `updateAppointment({ id, patch: { scheduledAt, durationMin } })`.
  Toast: "Appointment rescheduled."

Props: `{ open, onOpenChange, customers, vehicles, workOrders }` plus mode-specific
fields. Validation with zod (customer/vehicle/type required in book mode; date in
the future is a soft check, not enforced). On `.unwrap()` rejection, show an error
toast with the server message; keep the dialog open.

### 4. Interactive agenda in `BookingCalendar`

`src/components/service/booking-calendar.tsx` gains props:
`{ appointments, customers, vehicles, workOrders, canBook }`.

- The selected-day slot chips become an **agenda list**. Each entry renders a new
  `AppointmentAgendaRow` (`src/components/service/appointment-agenda-row.tsx`):
  `time · customer name · type` + `StatusBadge` + a `⋯` `DropdownMenu`:
  - **Confirm** — only when `status === "pending"`; dispatches
    `updateAppointment({ id, patch: { status: "confirmed" } })` + toast.
  - **Reschedule** — opens `AppointmentDialog` in reschedule mode for that row.
  - **Cancel** — opens an `AlertDialog`; on confirm dispatches
    `updateAppointment({ id, patch: { status: "cancelled" } })` + toast.
  - Cancelled/completed rows show the status but no destructive actions.
- When `canBook`, the card header shows a **Book** button that opens
  `AppointmentDialog` in book mode with the currently selected calendar day as
  `defaultDate`.
- Dialog/alert open-state and the "row being acted on" live in `BookingCalendar`
  local state.

### 5. Wiring per role

- **Owner** `src/components/service/service-screen.tsx` — pass `customers`,
  `vehicles`, `workOrders`, `canBook` to `BookingCalendar`. (`workOrders`,
  `customers`, `vehicles` are already fetched in this screen.)
- **Mechanic** `src/components/mechanic/mechanic-schedule-screen.tsx` — pass
  `myAppointments`, `customers`, `vehicles`, `workOrders`, `canBook`. The screen
  already filters appointments to the signed-in mechanic.

### 6. Error handling

- Every action uses `.unwrap()` inside `try/catch`; failure → error toast
  surfacing the server message; success → confirmation toast.
- Cancel is guarded by `AlertDialog` (no accidental cancels).
- Vehicle select is filtered to the chosen customer, so a mismatched
  customer/vehicle pair can't be submitted.
- Empty selected-day agenda keeps the existing "no bookings" copy.

## Components summary

| File | Change |
|---|---|
| `src/redux/appointments/appointments-thunks.ts` | + `createAppointment` |
| `src/redux/appointments/appointments-slice.ts` | + `createAppointment.fulfilled` |
| `src/lib/format.ts` | + `appointmentStatusLabels` / tones |
| `src/components/service/appointment-dialog.tsx` | **new** — book + reschedule |
| `src/components/service/appointment-agenda-row.tsx` | **new** — row + actions menu |
| `src/components/service/booking-calendar.tsx` | agenda list, Book button, new props |
| `src/components/service/service-screen.tsx` | pass new props |
| `src/components/mechanic/mechanic-schedule-screen.tsx` | pass new props |
| `src/components/dashboard/upcoming-appointments.tsx` | consume centralized status maps |

## Verification

1. `pnpm` type-check + lint clean.
2. Drive with the **verify** skill:
   - Owner: book an appointment → confirm it → reschedule it → cancel it.
   - Mechanic: repeat on one of their own appointments.
   - Screenshot each step; confirm the calendar dot + agenda update and toasts fire.
