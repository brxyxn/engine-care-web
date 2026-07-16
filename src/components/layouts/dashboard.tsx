"use server"

import { ReactNode } from "react"
import { NavBar } from "@/components/layouts/nav-bar"
import { SessionBoot } from "@/components/layouts/session-boot"
import { TopBar } from "@/components/layouts/top-bar"
import { SidebarInset } from "@/components/ui/sidebar"

export type DashboardLayoutProps = {
  children: ReactNode
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <>
      <SessionBoot />
      <NavBar />
      <SidebarInset>
        <TopBar />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </SidebarInset>
    </>
  )
}
