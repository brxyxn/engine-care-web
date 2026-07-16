import { RoleGate } from "@/components/layouts/role-gate"
import { ServiceScreen } from "@/components/service/service-screen"

export default function OwnerServicePage() {
  return (
    <RoleGate role="owner">
      <ServiceScreen />
    </RoleGate>
  )
}
