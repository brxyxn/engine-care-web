"use client"

import { ReactNode, useEffect, useRef } from "react"
import { Provider } from "react-redux"
import { PersistGate } from "redux-persist/integration/react"
import Loading from "@/layout/loading"
import { AppStore, makeStore, persistor } from "@/redux/store"
import { setupListeners } from "@reduxjs/toolkit/query"

interface Props {
  readonly children: ReactNode
}

export const ReduxProvider = ({ children }: Props) => {
  const storeRef = useRef<AppStore | null>(null)

  // eslint-disable-next-line react-hooks/refs
  if (!storeRef.current) {
    // Create the store instance the first time this renders
    storeRef.current = makeStore()
  }

  useEffect(() => {
    if (storeRef.current != null) {
      // configure listeners using the provided defaults
      // optional, but required for `refetchOnFocus`/`refetchOnReconnect` behaviors
      return setupListeners(storeRef.current.dispatch)
    }
  }, [])

  return (
    // eslint-disable-next-line react-hooks/refs
    <Provider store={storeRef.current}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  )
}
