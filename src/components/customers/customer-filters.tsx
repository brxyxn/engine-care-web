"use client"

import { cn } from "@/lib/utils"

export type CustomerFilter = "all" | CustomerStatus

export type CustomerFiltersProps = {
  customers: Customer[]
  value: CustomerFilter
  onChange: (value: CustomerFilter) => void
}

const filterLabels: { key: CustomerFilter; label: string }[] = [
  { key: "all", label: "All customers" },
  { key: "new", label: "New" },
  { key: "follow_up", label: "Follow-up required" },
  { key: "active", label: "Active" },
  { key: "archived", label: "Archived" },
]

export function CustomerFilters({
  customers,
  value,
  onChange,
}: CustomerFiltersProps) {
  const counts = new Map<CustomerFilter, number>([["all", customers.length]])
  for (const customer of customers) {
    counts.set(customer.status, (counts.get(customer.status) ?? 0) + 1)
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {filterLabels.map(({ key, label }) => {
        const count = counts.get(key) ?? 0
        const active = value === key
        return (
          <button
            key={key}
            type="button"
            onClick={() => onChange(key)}
            aria-pressed={active}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              active
                ? "bg-foreground text-background border-transparent font-medium"
                : "border-border text-muted-foreground hover:text-foreground hover:border-foreground/30"
            )}
          >
            {label}
            {key !== "all" && count > 0 && (
              <span className="ml-1.5 tabular-nums opacity-70">({count})</span>
            )}
          </button>
        )
      })}
    </div>
  )
}
