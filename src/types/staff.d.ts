type StaffRole = "owner" | "mechanic" | "superadmin"

type StaffMember = {
  id: string
  name: string
  role: StaffRole
  title: string
  avatarUrl: string
  /** Work orders currently assigned */
  activeTasks: number
  /** Max concurrent work orders */
  capacity: number
  completedMtd: number
  revenueMtd: number
}
