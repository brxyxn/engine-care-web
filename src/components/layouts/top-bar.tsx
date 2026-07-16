"use client"

import { useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { ThemeToggle } from "@/components/layouts/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
  selectNotifications,
  selectNotificationsStatus,
  selectUnreadCount,
} from "@/redux/notifications/notifications-slice"
import { fetchNotifications } from "@/redux/notifications/notifications-thunks"
import { selectSession } from "@/redux/session/session-slice"
import { switchRole } from "@/redux/session/session-thunks"
import { SliceStatus } from "@/redux/types"
import { Bell, Search } from "lucide-react"

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

const roleLabels: Record<StaffRole, string> = {
  owner: "General Manager",
  mechanic: "Mechanic",
  superadmin: "Platform Admin",
}

export function TopBar() {
  const dispatch = useAppDispatch()
  const session = useAppSelector(selectSession)
  const notifications = useAppSelector(selectNotifications)
  const notificationsStatus = useAppSelector(selectNotificationsStatus)
  const unreadCount = useAppSelector(selectUnreadCount)

  useEffect(() => {
    if (notificationsStatus === SliceStatus.IDLE) {
      dispatch(fetchNotifications())
    }
  }, [dispatch, notificationsStatus])

  return (
    <header className="border-border/60 flex h-(--header-height) shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />

      <div className="relative max-w-md flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
        <Input
          type="search"
          placeholder="Search customers, vehicles, orders…"
          className="bg-muted/50 h-9 rounded-full border-none pl-9"
        />
      </div>

      <div className="ml-auto flex items-center gap-1">
        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Notifications (${unreadCount} unread)`}
              className="relative"
            >
              <Bell />
              {unreadCount > 0 && (
                <span className="bg-primary text-primary-foreground absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full text-[10px] font-semibold">
                  {unreadCount}
                </span>
              )}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-96">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 && (
              <div className="text-muted-foreground px-2 py-6 text-center text-sm">
                Nothing new — you&apos;re all caught up.
              </div>
            )}
            <DropdownMenuGroup>
              {notifications.slice(0, 6).map((notification) => (
                <DropdownMenuItem
                  key={notification.id}
                  className="flex flex-col items-start gap-1 py-2"
                >
                  <div className="flex w-full items-center gap-2">
                    <span className="line-clamp-1 flex-1 text-sm font-medium">
                      {notification.title}
                    </span>
                    {notification.urgency === "urgent" && (
                      <Badge variant="destructive" className="rounded-full">
                        Urgent
                      </Badge>
                    )}
                  </div>
                  <span className="text-muted-foreground line-clamp-2 text-xs">
                    {notification.body}
                  </span>
                  <span className="text-muted-foreground/70 text-xs">
                    {formatDistanceToNow(new Date(notification.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-9 gap-2 px-2">
              <Avatar className="size-7">
                <AvatarFallback className="bg-primary/15 text-primary text-xs font-semibold">
                  {session ? initials(session.user.name) : "…"}
                </AvatarFallback>
              </Avatar>
              <span className="hidden flex-col items-start md:flex">
                <span className="text-sm leading-tight font-medium">
                  {session?.user.name ?? "Loading…"}
                </span>
                <span className="text-muted-foreground text-xs leading-tight">
                  {session ? roleLabels[session.user.role] : ""}
                </span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              {session?.shop.name ?? "EngineCare"}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-muted-foreground text-xs font-normal">
              View as (dev)
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={session?.user.role}
              onValueChange={(value) =>
                dispatch(switchRole(value as StaffRole))
              }
            >
              <DropdownMenuRadioItem value="owner">
                Owner — Ray Delgado
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="mechanic">
                Mechanic — Sarah Jenner
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>
              Sign out (coming with auth)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
