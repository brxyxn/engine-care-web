---
name: verify
description: Build/launch/drive recipe for verifying EngineCare web UI changes end-to-end
---

# Verifying engine-care-web

## Launch

```bash
PORT=3100 pnpm dev   # port 3000 is often taken by another app on this machine
```

Mock API routes serve from the same process (`/api/*`, seed data in
`src/app/api/_mock/db.ts`, dates relative to now). No backend needed.

## Auth

- Cookie-based session (`ec_session`, httpOnly). Signed-out users are redirected
  to `/login` by the AuthGate in `(app)/layout.tsx`. `GET /api/session` returns
  401 without the cookie.
- Demo logins (buttons on `/login` prefill these): `ray@enginecare.app` (owner),
  `sarah@enginecare.app` (mechanic), password `engine123`. Log in as each role
  to see its experience — there is no dev role-switcher anymore.
- The session is NOT persisted in redux (blacklisted); the cookie is the source
  of truth, restored via `/api/session` on boot.

## Drive

- App routes live under the `(app)` route group behind the AuthGate; auth pages
  under `(auth)`. Parallel role slots (`@owner`/`@mechanic`) are inside `(app)`.
- To preload a theme headlessly, use Playwright `--load-storage` with
  localStorage key `theme` (`light` | `dark`). For an authenticated session,
  drive the login form (the cookie is httpOnly, so it can't be injected via
  localStorage).
- Static screenshots: `npx -y playwright screenshot --viewport-size=... URL out.png`.
- Interactive flows (dialogs, kanban drag, role switch): install playwright in a
  scratch dir (`npm i playwright --no-save`) and script it; dnd-kit drags need
  `mouse.down/move(steps)/up` with >6px initial movement (activation constraint).

## Flows worth driving

1. Login: unauthed `/` → `/login`; bad password shows server message; demo login
   → dashboard; reload keeps session; Sign out → `/login` + `/api/session` 401
2. `/` owner dashboard (KPIs + chart render from /api data)
3. `/customers`: row click → detail panel; Confirm pending appointment → toast;
   Add customer (empty submit shows zod errors; valid submit prepends row)
4. `/vehicles`: Edit card → change a field → Save → persists across reload
   (stateful mock)
5. `/work-orders`: drag card between kanban columns → "moved to X" toast; the
   pencil on a card opens the edit sheet (line-items editor → estimate persists)
6. Log in as mechanic: nav loses Customers/Vehicles; deep-linking `/customers`
   renders empty (RoleGate), not a crash
7. Theme toggle → `html.class` flips light/dark

## Gotcha: kanban card edit locator

Cards are dnd-kit draggables (`.cursor-grab`). To click a card's pencil in a
test, scope to the card first (`locator('.cursor-grab').filter({ hasText })`)
— a global `getByRole('button', { name: /Edit WO-/ }).first()` can resolve to a
card whose button isn't hit-testable and the click silently misses.

## Gotchas

- `pnpm lint` runs the strict React Compiler rules: no `Date.now()`/random in
  render — capture time via `useState(() => Date.now())`.
- Mock POST/PATCH/DELETE are stateless (return the would-be result); UI state
  changes live only in Redux until reload.
