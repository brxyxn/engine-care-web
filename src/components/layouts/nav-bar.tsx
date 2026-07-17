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
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectRole } from "@/redux/session/session-slice"
import { openCreateWorkOrder } from "@/redux/ui/ui-slice"
import { selectOwnerActsAsMechanic } from "@/redux/workspace/workspace-capabilities"
import { IconInnerShadowTop } from "@tabler/icons-react"
import {
  Car,
  CalendarCheck,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  ClipboardPlus,
  LayoutDashboard,
  UsersRound,
  Wrench,
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
    title: "Appointments",
    url: "/service",
    icon: CalendarDays,
    roles: ["owner", "mechanic"],
  },
]

// Personal workbench, shown to an owner who also works as a mechanic. Gated by
// capability rather than the role array above.
const workbenchItems: Omit<NavItem, "roles">[] = [
  { title: "My Day", url: "/my-day", icon: CalendarCheck },
  { title: "My Work", url: "/my-work", icon: Wrench },
]

export function NavBar() {
  const { toggleSidebar, open } = useSidebar()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const role = useAppSelector(selectRole)
  const ownerActsAsMechanic = useAppSelector(selectOwnerActsAsMechanic)

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
                  onClick={() => dispatch(openCreateWorkOrder())}
                  tooltip="New Work Order"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <ClipboardPlus />
                  <span>New Work Order</span>
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

            {ownerActsAsMechanic && (
              <SidebarMenu>
                {workbenchItems.map((item) => (
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
            )}
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
