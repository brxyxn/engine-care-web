import { RoleGate } from "@/components/layouts/role-gate"

export default function OwnerWorkOrdersPage() {
  return (
    <RoleGate role="owner">
      <h1 className="text-2xl font-semibold">Work Orders</h1>
    </RoleGate>
  )
}
