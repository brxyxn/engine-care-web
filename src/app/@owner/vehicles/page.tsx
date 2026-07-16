import { RoleGate } from "@/components/layouts/role-gate"
import { VehiclesScreen } from "@/components/vehicles/vehicles-screen"

export default function OwnerVehiclesPage() {
  return (
    <RoleGate role="owner">
      <VehiclesScreen />
    </RoleGate>
  )
}
