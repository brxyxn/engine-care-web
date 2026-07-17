import { DashboardScreen } from "@/components/dashboard/dashboard-screen"
import { RoleGate } from "@/components/layouts/role-gate"

export default function OwnerPage() {
  return (
    <RoleGate role="owner">
      <DashboardScreen />
    </RoleGate>
  )
}
