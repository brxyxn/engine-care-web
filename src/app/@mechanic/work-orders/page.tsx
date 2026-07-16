import { RoleGate } from "@/components/layouts/role-gate"

export default function MechanicWorkOrdersPage() {
  return (
    <RoleGate role="mechanic">
      <h1 className="text-2xl font-semibold">My Work Orders</h1>
    </RoleGate>
  )
}
