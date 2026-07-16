import { Suspense } from "react"
import { RoleGate } from "@/components/layouts/role-gate"
import { WorkOrdersScreen } from "@/components/work-orders/work-orders-screen"

export default function OwnerWorkOrdersPage() {
  return (
    <RoleGate role="owner">
      {/* Suspense required by useSearchParams (opens the create dialog via ?new=1) */}
      <Suspense>
        <WorkOrdersScreen />
      </Suspense>
    </RoleGate>
  )
}
