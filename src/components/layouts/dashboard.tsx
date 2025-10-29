"use server"

import { ReactNode } from "react"
import { NavBar } from "@/components/layouts/nav-bar"
import { SidebarInset } from "@/components/ui/sidebar"

export type DashboardLayoutProps = {
  children: ReactNode
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <NavBar />
      <SidebarInset>{children}</SidebarInset>
    </>
  )
}
