"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
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
import { IconInnerShadowTop } from "@tabler/icons-react"
import {
  Car,
  ChevronLeft,
  ChevronRight,
  ClipboardPlus,
  House,
  MessagesSquare,
  PlusIcon,
  UsersRound,
} from "lucide-react"

type NavItem = {
  title: string
  url: string
  icon: ReactNode
}

/*
Home
Work Orders
Messages
Customers
Vehicles
* */
// nav items for mechanic users
const navItems: NavItem[] = [
  {
    title: "Home",
    url: "/",
    icon: <House />,
  },
  {
    title: "Work Orders",
    url: "/work-orders",
    icon: <ClipboardPlus />,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: <MessagesSquare />,
  },
  {
    title: "Customers",
    url: "/customers",
    icon: <UsersRound />,
  },
  {
    title: "Vehicles",
    url: "/vehicles",
    icon: <Car />,
  },
]

export function NavBar() {
  const { toggleSidebar, open } = useSidebar()

  return (
    <Sidebar collapsible="icon" variant={"inset"}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="#">
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">{"EngineCare"}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/*  Add links here*/}
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2">
            <SidebarMenu>
              <SidebarMenuItem className="flex items-center gap-2">
                <SidebarMenuButton
                  tooltip="Quick Create"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
                >
                  <ClipboardPlus />
                  <span>New Work Order</span>
                </SidebarMenuButton>
                <Button
                  size="icon"
                  className="size-8 group-data-[collapsible=icon]:opacity-0"
                  variant="outline"
                >
                  <PlusIcon />
                  <span className="sr-only">New Work Order</span>
                </Button>
              </SidebarMenuItem>
            </SidebarMenu>

            {navItems.map((item) => (
              <SidebarMenu key={item.title}>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <Link href={item.url}>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            ))}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button onClick={toggleSidebar} variant={"secondary"}>
                {open ? <ChevronLeft /> : <ChevronRight />}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
