import { CustomersScreen } from "@/components/customers/customers-screen"
import { RoleGate } from "@/components/layouts/role-gate"

export default function OwnerCustomersPage() {
  return (
    <RoleGate role="owner">
      <CustomersScreen />
    </RoleGate>
  )
}
