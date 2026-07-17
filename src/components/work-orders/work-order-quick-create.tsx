"use client"

import { Button } from "@/components/ui/button"
import { CreateWorkOrderSheet } from "@/components/work-orders/create-work-order-sheet"
import { useCustomers, useStaff, useVehicles } from "@/hooks/use-data"
import { useIsMobile } from "@/hooks/use-mobile"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
  openCreateWorkOrder,
  selectCreateWorkOrderOpen,
  setCreateWorkOrderOpen,
} from "@/redux/ui/ui-slice"
import { selectRole } from "@/redux/session/session-slice"
import { ClipboardPlus } from "lucide-react"

/**
 * App-wide host for the "New work order" Sheet plus a mobile FAB. Mounted once
 * in the dashboard layout so the sheet can be opened from the sidebar, the FAB,
 * or the Work Orders header regardless of the current route.
 */
export function WorkOrderQuickCreate() {
  const dispatch = useAppDispatch()
  const open = useAppSelector(selectCreateWorkOrderOpen)
  const role = useAppSelector(selectRole)
  const isMobile = useIsMobile()
  const { customers } = useCustomers()
  const { vehicles } = useVehicles()
  const { staff } = useStaff()

  // Only roles that can act on work orders get the quick-create affordance.
  const canCreate = role === "owner" || role === "mechanic"
  if (!canCreate) return null

  return (
    <>
      {isMobile && (
        <Button
          size="icon"
          onClick={() => dispatch(openCreateWorkOrder())}
          aria-label="New work order"
          className="fixed right-6 bottom-6 z-50 size-14 rounded-full shadow-lg"
        >
          <ClipboardPlus className="size-6" />
        </Button>
      )}

      <CreateWorkOrderSheet
        open={open}
        onOpenChange={(next) => dispatch(setCreateWorkOrderOpen(next))}
        customers={customers ?? []}
        vehicles={vehicles ?? []}
        staff={staff ?? []}
      />
    </>
  )
}
