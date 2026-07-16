"use client"

import { ReactNode } from "react"
import { useAppSelector } from "@/redux/hooks"
import { selectRole } from "@/redux/session/session-slice"

export type RoleGateProps = {
  role: StaffRole
  children: ReactNode
}

/**
 * Renders children only when the session role matches. Each parallel route
 * slot (@owner, @mechanic, @superadmin) wraps its pages in this gate so the
 * root layout can mount every slot unconditionally.
 */
export function RoleGate({ role, children }: RoleGateProps) {
  const currentRole = useAppSelector(selectRole)
  if (currentRole !== role) {
    return null
  }
  return <>{children}</>
}
