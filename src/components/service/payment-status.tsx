"use client"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { formatCurrency } from "@/lib/format"
import { CreditCard } from "lucide-react"
import { toast } from "sonner"

export type PaymentStatusProps = {
  payments: ServiceStats["payments"]
}

export function PaymentStatus({ payments }: PaymentStatusProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="size-4" />
          Payment Status
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">Outstanding invoices</span>
          <span className="font-semibold">
            {formatCurrency(payments.outstandingTotal)}
          </span>
        </div>
        <div className="flex items-baseline justify-between text-sm">
          <span className="text-muted-foreground">Expected today</span>
          <span className="font-semibold">
            {formatCurrency(payments.expectedToday)}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <Progress value={payments.collectionRatePct} className="h-1.5" />
          <p className="text-muted-foreground text-xs">
            Collection rate {payments.collectionRatePct}% vs last month
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() =>
            toast.info("Card processing connects with the payments phase", {
              description:
                "Outstanding invoices can be collected once the Go backend links a payment provider.",
            })
          }
        >
          Process payment
        </Button>
      </CardContent>
    </Card>
  )
}
