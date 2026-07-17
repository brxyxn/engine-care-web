import { RoleGate } from "@/components/layouts/role-gate"
import { MechanicScheduleScreen } from "@/components/mechanic/mechanic-schedule-screen"

export default function MechanicSchedulePage() {
  return (
    <RoleGate role="mechanic">
      <MechanicScheduleScreen />
    </RoleGate>
  )
}
