import { ReactNode } from "react"
import { IconInnerShadowTop } from "@tabler/icons-react"

const highlights = [
  "Track every work order from intake to delivery",
  "Automated reminders sent on your behalf",
  "Customers, vehicles, and history in one place",
]

export type AuthShellProps = {
  title: string
  subtitle: string
  children: ReactNode
  footer: ReactNode
}

/** Split brand + form layout shared by login and signup. */
export function AuthShell({ title, subtitle, children, footer }: AuthShellProps) {
  return (
    <div className="bg-card w-full max-w-4xl overflow-hidden rounded-2xl border shadow-xl md:grid md:grid-cols-2">
      {/* Brand panel */}
      <div className="from-primary/25 via-primary/5 relative hidden flex-col justify-between bg-gradient-to-br to-transparent p-8 md:flex">
        <div className="flex items-center gap-2">
          <IconInnerShadowTop className="text-primary size-6" />
          <span className="text-lg font-semibold">EngineCare</span>
        </div>
        <div className="flex flex-col gap-5">
          <p className="text-xl leading-snug font-medium">
            The shop-floor system for work orders, customers, and vehicles.
          </p>
          <ul className="flex flex-col gap-3">
            {highlights.map((line) => (
              <li key={line} className="flex items-start gap-2.5 text-sm">
                <span className="bg-primary mt-1.5 size-1.5 shrink-0 rounded-full" />
                <span className="text-muted-foreground">{line}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-muted-foreground text-xs">
          © {new Date().getFullYear()} EngineCare
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center gap-6 p-8">
        <div className="flex items-center gap-2 md:hidden">
          <IconInnerShadowTop className="text-primary size-6" />
          <span className="text-lg font-semibold">EngineCare</span>
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>
        </div>
        {children}
        <div className="text-muted-foreground text-center text-sm">
          {footer}
        </div>
      </div>
    </div>
  )
}
