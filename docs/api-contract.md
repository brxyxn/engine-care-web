# EngineCare API Contract

The frontend defines this contract; the Go backend implements it. Every endpoint below is currently mocked by a Next.js route handler under `src/app/api/`, backed by seed data in `src/app/api/_mock/db.ts`. Entity shapes are the ambient TypeScript types in `src/types/*.d.ts` — those files are the source of truth; this document mirrors them with example payloads.

## Conventions

- Base path: `/api` (the Go service should serve the same paths, or the frontend base URL will be pointed at it via env var).
- All responses use the envelope:
  ```json
  { "success": true, "data": <payload> }
  ```
  Errors:
  ```json
  { "success": false, "error": "<message>" }
  ```
  with an appropriate HTTP status (400 validation, 404 not found, etc.).
- Timestamps are ISO-8601 strings in UTC (e.g. `"2026-07-16T14:30:00.000Z"`).
- Money values are numbers in whole currency units (USD). The Go backend may switch to integer cents; if so, the frontend will adapt in one place.
- IDs are opaque strings (`cus_001`, `wo_482`). Human-readable numbers (`WO-0482`, `INV-2026-042`) are display fields, not identifiers.
- List endpoints accept optional query filters listed per endpoint. Unknown params are ignored. Pagination (`?page=&limit=`) is reserved and not yet consumed by the UI — lists are currently small.
- Mock behavior note: the Next mocks are **stateful within a running server process** — `POST`/`PATCH`/`DELETE` mutate an in-memory store, so changes persist across requests until the server restarts. There is no cross-process durability; the Go backend provides the real database.

## Auth & session

Cookie-based session. `POST /api/auth/login` (and `/signup`) sets an httpOnly
`ec_session` cookie; `GET /api/session` reads it and returns the current user, or
`401` when signed out. The mock stores the user id in the cookie in plaintext —
the Go backend should issue a signed token (JWT or opaque session id) instead,
keeping the same cookie name and the same `Session` response shape. All
authenticated endpoints should require a valid cookie; the mock does not yet
enforce this on resource routes.

### `POST /api/auth/login`
Body `{ email, password }`. Sets the session cookie and returns the `Session`.
`401` on bad credentials, `400` on missing fields.

Demo credentials (mock only): `ray@enginecare.app` / `engine123` (owner),
`sarah@enginecare.app` / `engine123` (mechanic).

```json
{
  "success": true,
  "data": {
    "user": { "id": "stf_001", "name": "Ray Delgado", "role": "owner", "avatarUrl": "" },
    "shop": { "id": "shop_001", "name": "EngineCare Garage" }
  }
}
```

### `POST /api/auth/signup`
Body `{ name, email, password, shopName }`. Creates a shop-owner account (and a
staff member for the owner), sets the cookie, returns the `Session` (201).
`409` when the email is already registered.

### `POST /api/auth/logout`
Clears the session cookie. Returns `{ success: true, data: null }`.

### `GET /api/session`
Current user + shop context from the cookie. `401` when unauthenticated.

`role`: `"owner" | "mechanic" | "superadmin"`. The UI renders a different
experience per role (owner: full app; mechanic: My Day / their work orders /
schedule).

## Customers

Entity:

```json
{
  "id": "cus_001",
  "name": "Jane Dorsey",
  "email": "jane.dorsey@gmail.com",
  "phone": "+1 512 555 0142",
  "avatarUrl": "",
  "status": "active",
  "location": "Austin, TX",
  "tags": ["repeat"],
  "lastInteraction": { "type": "phone_call", "at": "2026-07-16T12:30:00.000Z" },
  "lifetimeValue": 4250,
  "vehicleIds": ["veh_001"],
  "createdAt": "2025-06-01T00:00:00.000Z"
}
```

- `status`: `"new" | "follow_up" | "active" | "archived"`
- `lastInteraction.type`: `"phone_call" | "email" | "visit" | "form_submitted" | "estimate_sent" | "no_activity"`; `lastInteraction` may be `null`.

| Method | Path | Query / Body | Returns |
|---|---|---|---|
| GET | `/api/customers` | `?status=`, `?q=` (name/email substring) | `Customer[]` |
| POST | `/api/customers` | `{ name, email, phone, location }` | created `Customer` (201) |
| GET | `/api/customers/:id` | — | `Customer` |
| PATCH | `/api/customers/:id` | partial `Customer` | updated `Customer` |
| DELETE | `/api/customers/:id` | — | `{ id }` |

## Vehicles

Entity:

```json
{
  "id": "veh_001",
  "customerId": "cus_001",
  "make": "Toyota",
  "model": "RAV4",
  "year": 2021,
  "vin": "2T3P1RFV8MC143921",
  "licensePlate": "GPR-402",
  "mileage": 41250,
  "engine": "2.5L I4",
  "transmission": "Automatic",
  "fuelType": "gasoline",
  "photoUrl": "",
  "status": "ready",
  "listPrice": null,
  "lastServiceAt": "2026-07-15T10:00:00.000Z"
}
```

- `customerId` is `null` for shop-owned stock (dealership case).
- `status`: `"active" | "in_shop" | "ready" | "for_sale"`
- `fuelType`: `"gasoline" | "diesel" | "hybrid" | "electric"`
- `listPrice` is set only when `status = "for_sale"`.

| Method | Path | Query / Body | Returns |
|---|---|---|---|
| GET | `/api/vehicles` | `?status=`, `?make=`, `?q=` (make/model/VIN/plate) | `Vehicle[]` |
| POST | `/api/vehicles` | `{ customerId, make, model, year, vin, licensePlate, mileage, engine, transmission, fuelType }` | created `Vehicle` (201) |
| GET | `/api/vehicles/:id` | — | `Vehicle` |
| PATCH | `/api/vehicles/:id` | partial `Vehicle` | updated `Vehicle` |
| DELETE | `/api/vehicles/:id` | — | `{ id }` |

Future (documented, not yet consumed): `GET /api/vehicles/vin/:vin` — VIN decode for prefilling the add-vehicle form.

## Work orders

The core entity. Kanban pipeline: `intake → diagnostics → in_repair → waiting_parts → ready → delivered`.

```json
{
  "id": "wo_482",
  "number": "WO-0482",
  "customerId": "cus_005",
  "vehicleId": "veh_005",
  "assignedMechanicId": "stf_002",
  "status": "diagnostics",
  "priority": "high",
  "serviceType": "engine_diagnostic",
  "title": "Check engine light — cylinder misfire",
  "description": "Customer reports rough idle...",
  "progressPct": 40,
  "lineItems": [{ "description": "Diagnostic labor (2h)", "qty": 2, "unitPrice": 120 }],
  "estimateTotal": 1240,
  "scheduledAt": "2026-07-16T09:30:00.000Z",
  "completedAt": null,
  "notes": [{ "id": "won_001", "authorId": "stf_002", "body": "...", "at": "2026-07-16T11:00:00.000Z" }],
  "createdAt": "2026-07-15T09:00:00.000Z"
}
```

- `priority`: `"low" | "normal" | "high" | "urgent"`
- `serviceType`: `"engine_diagnostic" | "brake_system" | "tire_rotation" | "electrical" | "general_repair" | "inspection" | "maintenance"`
- `assignedMechanicId` may be `null` (unassigned).

| Method | Path | Query / Body | Returns |
|---|---|---|---|
| GET | `/api/work-orders` | `?status=`, `?assignedMechanicId=` | `WorkOrder[]` |
| POST | `/api/work-orders` | partial `WorkOrder` (title, customerId, vehicleId, serviceType, priority, …) | created `WorkOrder` (201) |
| GET | `/api/work-orders/:id` | — | `WorkOrder` |
| PATCH | `/api/work-orders/:id` | partial `WorkOrder` — used for kanban status moves (`{ "status": "in_repair" }`), assignee changes, note appends | updated `WorkOrder` |

Backend rules the UI assumes: moving to `ready` implies `progressPct = 100`; moving to `delivered` sets `completedAt`. The `number` sequence is backend-owned.

## Appointments

```json
{
  "id": "app_004",
  "customerId": "cus_001",
  "vehicleId": "veh_001",
  "workOrderId": "wo_484",
  "type": "pickup",
  "scheduledAt": "2026-07-16T13:30:00.000Z",
  "durationMin": 15,
  "status": "confirmed"
}
```

- `type`: `"drop_off" | "pickup" | "inspection" | "service"`
- `status`: `"pending" | "confirmed" | "completed" | "cancelled" | "no_show"`
- `workOrderId` may be `null`.

| Method | Path | Query / Body | Returns |
|---|---|---|---|
| GET | `/api/appointments` | `?customerId=`, `?status=` | `Appointment[]` |
| POST | `/api/appointments` | `Appointment` minus `id`/`status` | created `Appointment` (201, status `pending`) |
| PATCH | `/api/appointments/:id` | partial — confirm (`{ "status": "confirmed" }`), reschedule (`{ "scheduledAt": … }`), cancel | updated `Appointment` |

## Invoices & estimates

```json
{
  "id": "inv_001",
  "workOrderId": "wo_484",
  "number": "INV-2026-042",
  "kind": "invoice",
  "amount": 450,
  "status": "pending",
  "recipient": "Jane Dorsey",
  "issuedAt": "2026-07-16T10:00:00.000Z",
  "dueAt": "2026-07-30T10:00:00.000Z"
}
```

- `kind`: `"estimate" | "invoice"`; `status`: `"draft" | "sent" | "pending" | "paid" | "overdue"`; `dueAt` null for estimates.

| Method | Path | Returns |
|---|---|---|
| GET | `/api/invoices` | `Invoice[]` |

(Phase 1 is read-only; create/send/pay flows come with the payments phase.)

## Staff

```json
{
  "id": "stf_002",
  "name": "Sarah Jenner",
  "role": "mechanic",
  "title": "Senior Technician",
  "avatarUrl": "",
  "activeTasks": 6,
  "capacity": 8,
  "completedMtd": 21,
  "revenueMtd": 24800
}
```

| Method | Path | Returns |
|---|---|---|
| GET | `/api/staff` | `StaffMember[]` (workload/performance fields included) |

## Dashboard & service stats

### `GET /api/dashboard/stats`

```json
{
  "vehiclesInService": { "value": 12, "delta": { "amount": 3, "label": "vs last week", "direction": "up" } },
  "activeCustomers": { "value": 148, "delta": { "amount": 9, "label": "new this month", "direction": "up" } },
  "monthlyRevenue": { "value": 42600, "delta": { "amount": 8400, "label": "this period", "direction": "up" } },
  "bookings": [{ "week": "Week 1", "workOrders": 18, "appointments": 24 }],
  "serviceRequests": [{ "serviceType": "engine_diagnostic", "pct": 32 }],
  "revenueTrend": [{ "week": "Week 1", "revenue": 8900 }]
}
```

### `GET /api/dashboard/activity`
Recent activity feed rows: `{ id, customerId, vehicleId, type: "sale" | "service", status: "complete" | "pending" | "in_progress", value, at }[]`.

### `GET /api/service/stats`

```json
{
  "appointmentsToday": { "value": 5, "delta": { "amount": 2, "label": "more than yesterday", "direction": "up" } },
  "serviceRevenue": { "value": 8050, "delta": { "amount": 82, "label": "weekly target: 82%", "direction": "up" } },
  "completedServices": { "value": 38, "delta": { "amount": 4.9, "label": "avg satisfaction 4.9/5", "direction": "up" } },
  "pendingRepairs": { "value": 12, "delta": { "amount": 3, "label": "delayed by parts", "direction": "down" } },
  "payments": { "outstandingTotal": 3210, "expectedToday": 1410, "collectionRatePct": 68 }
}
```

## Notifications & reminders

Automation is a core product feature: the backend sends reminders (SMS/email) on the shop's behalf and surfaces what it did.

### `GET /api/notifications`
In-app notification feed:

```json
{
  "id": "not_001",
  "kind": "reminder",
  "urgency": "urgent",
  "title": "Pickup reminder sent — Jane Dorsey",
  "body": "Automated SMS sent for RAV4 pickup at 1:30 PM...",
  "relatedCustomerId": "cus_001",
  "relatedWorkOrderId": "wo_484",
  "createdAt": "2026-07-16T12:30:00.000Z",
  "read": false
}
```

- `kind`: `"reminder" | "system" | "payment"`; `urgency`: `"low" | "normal" | "urgent"`.

### `GET /api/reminders`
Automated outbound reminders already sent: `{ id, urgency, title, body, channel: "sms" | "email" | "in_app", relatedCustomerId, relatedWorkOrderId, sentAt }[]`.

Future (reserved): `PATCH /api/notifications/:id` (`{ "read": true }`), reminder rule configuration endpoints.
