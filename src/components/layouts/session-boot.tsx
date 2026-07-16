"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectSessionStatus } from "@/redux/session/session-slice"
import { fetchSession } from "@/redux/session/session-thunks"
import { SliceStatus } from "@/redux/types"

/** Loads the mock session once per app boot (no login flow in phase 1). */
export function SessionBoot() {
  const dispatch = useAppDispatch()
  const status = useAppSelector(selectSessionStatus)

  useEffect(() => {
    if (status === SliceStatus.IDLE) {
      dispatch(fetchSession())
    }
  }, [dispatch, status])

  return null
}
