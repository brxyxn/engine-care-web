import { RoleGate } from "@/components/layouts/role-gate"

export default function OwnerCustomersPage() {
  return (
    <RoleGate role="owner">
      <h1 className="text-2xl font-semibold">Customer List</h1>
    </RoleGate>
  )
}
