"use client"

import { StatusBadge, StatusTone } from "@/components/shared/status-badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { formatCurrency } from "@/lib/format"
import { FileText } from "lucide-react"

const statusMeta: Record<InvoiceStatus, { label: string; tone: StatusTone }> = {
  draft: { label: "Draft", tone: "muted" },
  sent: { label: "Sent", tone: "info" },
  pending: { label: "Pending", tone: "warning" },
  paid: { label: "Paid", tone: "success" },
  overdue: { label: "Overdue", tone: "destructive" },
}

export type InvoicesListProps = {
  invoices: Invoice[]
}

export function InvoicesList({ invoices }: InvoicesListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estimates &amp; Invoices</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {invoices.length === 0 && (
          <p className="text-muted-foreground py-6 text-center text-sm">
            Estimates appear here as work orders are quoted.
          </p>
        )}
        {invoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center gap-3">
            <span className="bg-muted text-muted-foreground flex size-9 shrink-0 items-center justify-center rounded-lg">
              <FileText className="size-4" />
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span className="data-id font-medium">{invoice.number}</span>
              <span className="text-muted-foreground truncate text-xs">
                {invoice.kind === "estimate" ? "Estimate for" : "Sent to"}{" "}
                {invoice.recipient}
              </span>
            </div>
            <span className="text-sm font-medium">
              {formatCurrency(invoice.amount)}
            </span>
            <StatusBadge tone={statusMeta[invoice.status].tone}>
              {statusMeta[invoice.status].label}
            </StatusBadge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
