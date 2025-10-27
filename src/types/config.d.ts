// import { IconName } from "lucide-react/dynamic"

type NavItem = {
  title: string
  url: string
  icon: IconName
  description?: string
  tooltip?: string
  disabled?: boolean
}

type User = {
  id: string
  name: string
  email: string
  avatar: string
}

type UserConfigData = {
  user: User
  navMain: NavItem[]
  reports: NavItem[]
  engineCareSettings: NavItem[]
}
