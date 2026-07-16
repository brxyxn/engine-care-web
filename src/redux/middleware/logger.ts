import { RootState } from "@/redux/store"
import type { Action, Dispatch, Middleware } from "@reduxjs/toolkit"

export type AppMiddleware = Middleware<object, RootState, Dispatch<Action>>

const actionType = (action: unknown): string =>
  typeof action === "object" && action !== null && "type" in action
    ? String((action as Action).type)
    : "unknown"

export const logger: AppMiddleware = (storeAPI) => (next) => (action) => {
  if (process.env.NODE_ENV === "production") {
    // Keep production quiet; remove this guard if you want prod logs.
    return next(action)
  }

  const prevState = storeAPI.getState()
  // Group by action type; groupCollapsed keeps the console tidy
  /* eslint-disable no-console */
  console.groupCollapsed(`🪵 action: ${actionType(action)}`)
  console.log("prev state:", prevState)
  console.log("action:", action)

  const result = next(action)

  const nextState = storeAPI.getState()
  console.log("next state:", nextState)
  console.groupEnd()
  /* eslint-enable no-console */

  return result
}
