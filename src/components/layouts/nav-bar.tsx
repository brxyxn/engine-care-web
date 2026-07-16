"use client"

import { ComponentType } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useAppSelector } from "@/redux/hooks"
import { selectRole } from "@/redux/session/session-slice"
import { IconInnerShadowTop } from "@tabler/icons-react"
import {
  Car,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ClipboardPlus,
  LayoutDashboard,
  UsersRound,
} from "lucide-react"

type NavItem = {
  title: string
  url: string
  icon: ComponentType<{ className?: string }>
  roles: StaffRole[]
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
    roles: ["owner", "mechanic"],
  },
  {
    title: "Customers",
    url: "/customers",
    icon: UsersRound,
    roles: ["owner"],
  },
  {
    title: "Vehicles",
    url: "/vehicles",
    icon: Car,
    roles: ["owner"],
  },
  {
    title: "Work Orders",
    url: "/work-orders",
    icon: ClipboardList,
    roles: ["owner", "mechanic"],
  },
  {
    title: "Service",
    url: "/service",
    icon: CalendarDays,
    roles: ["owner", "mechanic"],
  },
]

export function NavBar() {
  const { toggleSidebar, open } = useSidebar()
  const pathname = usePathname()
  const role = useAppSelector(selectRole)

  const visibleItems = navItems.filter(
    (item) => role === null || item.roles.includes(role)
  )

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconInnerShadowTop className="text-primary !size-5" />
                <span className="text-base font-semibold">EngineCare</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="New Work Order"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <Link href="/work-orders?new=1">
                    <ClipboardPlus />
                    <span>New Work Order</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu>
              {visibleItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={pathname === item.url}
                  >
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={toggleSidebar}
              tooltip={open ? "Collapse sidebar" : "Expand sidebar"}
            >
              {open ? <ChevronLeft /> : <ChevronRight />}
              <span>Collapse</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
