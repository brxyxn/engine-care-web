import { RoleGate } from "@/components/layouts/role-gate"

export default function MechanicSchedulePage() {
  return (
    <RoleGate role="mechanic">
      <h1 className="text-2xl font-semibold">My Schedule</h1>
    </RoleGate>
  )
}
