import { RoleGate } from "@/components/layouts/role-gate"
import { MyDayScreen } from "@/components/mechanic/my-day-screen"

export default function MechanicPage() {
  return (
    <RoleGate role="mechanic">
      <MyDayScreen />
    </RoleGate>
  )
}
