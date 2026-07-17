import { ReactNode } from "react"

/** Minimal shell for signed-out pages — no sidebar or top bar. */
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh items-center justify-center p-6">
      {children}
    </div>
  )
}
