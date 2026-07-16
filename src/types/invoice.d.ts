type InvoiceKind = "estimate" | "invoice"

type InvoiceStatus = "draft" | "sent" | "pending" | "paid" | "overdue"

type Invoice = {
  id: string
  workOrderId: string
  /** Human-readable number, e.g. "INV-2026-042" or "EST-2026-015" */
  number: string
  kind: InvoiceKind
  amount: number
  status: InvoiceStatus
  /** Customer-facing recipient label, e.g. "Sent to Jane Doe" */
  recipient: string
  issuedAt: string
  dueAt: string | null
}
