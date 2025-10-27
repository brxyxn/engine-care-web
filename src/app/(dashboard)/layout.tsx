import { ReactNode } from "react"

export default function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode
  owner: ReactNode
  mechanic: ReactNode
  superadmin: ReactNode
}>) {
  return (
    <>
      <h2>Something</h2>
      {children}
    </>
  )
}
