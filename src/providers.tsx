import { CSSProperties, ReactNode } from "react"
import { SidebarProvider } from "@/components/ui/sidebar"
import { ReduxProvider } from "@/redux/provider"

type ProvidersProps = Readonly<{
  children: ReactNode
}>

export default function Providers({ children }: ProvidersProps) {
  return (
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
  )
}
