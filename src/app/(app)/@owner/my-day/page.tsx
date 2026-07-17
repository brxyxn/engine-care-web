import { RoleGate } from "@/components/layouts/role-gate"
import { MyDayScreen } from "@/components/mechanic/my-day-screen"

export default function OwnerMyDayPage() {
  return (
    <RoleGate role="owner">
      <MyDayScreen />
    </RoleGate>
  )
}
