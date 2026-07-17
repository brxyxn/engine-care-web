"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import Loader from "@/components/layouts/loader"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
  selectSession,
  selectSessionStatus,
} from "@/redux/session/session-slice"
import { fetchSession } from "@/redux/session/session-thunks"
import { SliceStatus } from "@/redux/types"

/**
 * Protects the app shell: resolves the session from the auth cookie on boot and
 * redirects to /login when there is none. Renders children only once a session
 * is present.
 */
export function AuthGate({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const session = useAppSelector(selectSession)
  const status = useAppSelector(selectSessionStatus)

  useEffect(() => {
    if (status === SliceStatus.IDLE) {
      dispatch(fetchSession())
    }
  }, [dispatch, status])

  useEffect(() => {
    if (status === SliceStatus.FAILED && !session) {
      router.replace("/login")
    }
  }, [status, session, router])

  if (!session) {
    return <Loader />
  }

  return <>{children}</>
}
