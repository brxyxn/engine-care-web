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

## Drive

- Roles use parallel route slots gated by the Redux session. Default session is
  owner (Ray Delgado). Switch roles via the user menu → "View as (dev)".
- To preload a role or theme headlessly, use Playwright `--load-storage` with
  localStorage keys: `persist:root` (redux-persist; `session` slice JSON-string)
  and `theme` (`light` | `dark`).
- Static screenshots: `npx -y playwright screenshot --viewport-size=... URL out.png`.
- Interactive flows (dialogs, kanban drag, role switch): install playwright in a
  scratch dir (`npm i playwright --no-save`) and script it; dnd-kit drags need
  `mouse.down/move(steps)/up` with >6px initial movement (activation constraint).

## Flows worth driving

1. `/` owner dashboard (KPIs + chart render from /api data)
2. `/customers`: row click → detail panel; Confirm pending appointment → toast;
   Add customer (empty submit shows zod errors; valid submit prepends row)
3. `/work-orders`: drag card between kanban columns → "moved to X" toast
4. User menu role switch → mechanic: nav loses Customers/Vehicles; deep-linking
   `/customers` as mechanic renders empty (RoleGate), not a crash
5. Theme toggle → `html.class` flips light/dark

## Gotchas

- `pnpm lint` runs the strict React Compiler rules: no `Date.now()`/random in
  render — capture time via `useState(() => Date.now())`.
- Mock POST/PATCH/DELETE are stateless (return the would-be result); UI state
  changes live only in Redux until reload.
