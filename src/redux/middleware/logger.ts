import { RootState } from "@/redux/store"
import type { Action, Dispatch, Middleware } from "@reduxjs/toolkit"

export type AppMiddleware = Middleware<{}, RootState, Dispatch<Action>>

export const logger: AppMiddleware = (storeAPI) => (next) => (action: any) => {
  if (process.env.NODE_ENV === "production") {
    // Keep production quiet; remove this guard if you want prod logs.
    return next(action)
  }

  const prevState = storeAPI.getState()
  // Group by action type for nice console output
  // Using console.groupCollapsed avoids noisy logs
  console.groupCollapsed(`🪵 action: ${action.type}`) // todo: check if we can get the action.type here, currently shows
  // error since this action type is unknown
  console.log("prev state:", prevState)
  console.log("action:", action)

  const result = next(action)

  const nextState = storeAPI.getState()
  console.log("next state:", nextState)
  console.groupEnd()

  return result
}
