import { RoleGate } from "@/components/layouts/role-gate"
import { MechanicWorkOrdersScreen } from "@/components/mechanic/mechanic-work-orders-screen"

export default function OwnerMyWorkPage() {
  return (
    <RoleGate role="owner">
      <MechanicWorkOrdersScreen />
    </RoleGate>
  )
}
