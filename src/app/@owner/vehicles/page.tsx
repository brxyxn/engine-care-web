import { RoleGate } from "@/components/layouts/role-gate"

export default function OwnerVehiclesPage() {
  return (
    <RoleGate role="owner">
      <h1 className="text-2xl font-semibold">Vehicles</h1>
    </RoleGate>
  )
}
