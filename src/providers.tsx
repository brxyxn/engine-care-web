"use client"

import { CSSProperties, ReactNode } from "react"
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ReduxProvider } from "@/redux/provider"

type ProvidersProps = Readonly<{
  children: ReactNode
}>

export default function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <ReduxProvider>
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as CSSProperties
          }
        >
          {children}
        </SidebarProvider>
      </ReduxProvider>
    </ThemeProvider>
  )
}
