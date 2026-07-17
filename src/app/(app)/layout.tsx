import { ReactNode } from "react"
import { AuthGate } from "@/components/layouts/auth-gate"
import { DashboardLayout } from "@/components/layouts/dashboard"

export default function AppLayout({
  children,
  owner,
  mechanic,
  superadmin,
}: Readonly<{
  children: ReactNode
  owner: ReactNode
  mechanic: ReactNode
  superadmin: ReactNode
}>) {
  return (
    <AuthGate>
      <DashboardLayout>
        {mechanic}
        {owner}
        {superadmin}
        {children}
      </DashboardLayout>
    </AuthGate>
  )
}
