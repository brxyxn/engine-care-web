import { ReactNode } from "react"

export type DashboardLayoutProps = {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <>{children}</>
}
