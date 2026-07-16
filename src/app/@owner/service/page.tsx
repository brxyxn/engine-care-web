import { RoleGate } from "@/components/layouts/role-gate"

export default function OwnerServicePage() {
  return (
    <RoleGate role="owner">
      <h1 className="text-2xl font-semibold">Service Dashboard</h1>
    </RoleGate>
  )
}
