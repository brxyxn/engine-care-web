"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  formatCurrency,
  serviceTypeLabels,
  workOrderStatusLabels,
} from "@/lib/format"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { updateWorkOrder } from "@/redux/work-orders/work-orders-thunks"
import { selectOwnersWorkAsMechanics } from "@/redux/workspace/workspace-capabilities"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

const UNASSIGNED = "unassigned"

const statuses = Object.keys(workOrderStatusLabels) as WorkOrderStatus[]
const priorities: WorkOrderPriority[] = ["low", "normal", "high", "urgent"]
const serviceTypes = Object.keys(serviceTypeLabels) as ServiceType[]

export type WorkOrderEditSheetProps = {
  workOrder: WorkOrder
  staff: StaffMember[]
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function WorkOrderEditSheet({
  workOrder,
  staff,
  open,
  onOpenChange,
}: WorkOrderEditSheetProps) {
  const dispatch = useAppDispatch()
  const ownersWork = useAppSelector(selectOwnersWorkAsMechanics)
  const [saving, setSaving] = useState(false)

  const [title, setTitle] = useState(workOrder.title)
  const [status, setStatus] = useState<WorkOrderStatus>(workOrder.status)
  const [priority, setPriority] = useState<WorkOrderPriority>(
    workOrder.priority
  )
  const [serviceType, setServiceType] = useState<ServiceType>(
    workOrder.serviceType
  )
  const [assignee, setAssignee] = useState(
    workOrder.assignedMechanicId ?? UNASSIGNED
  )
  const [lineItems, setLineItems] = useState<WorkOrderLineItem[]>(
    workOrder.lineItems.length > 0
      ? workOrder.lineItems
      : [{ description: "", qty: 1, unitPrice: 0 }]
  )

  const mechanics = staff.filter(
    (s) => s.role === "mechanic" || (ownersWork && s.role === "owner")
  )
  const total = lineItems.reduce(
    (sum, item) => sum + item.qty * item.unitPrice,
    0
  )

  const setItem = (index: number, patch: Partial<WorkOrderLineItem>) => {
    setLineItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...patch } : item))
    )
  }
  const addItem = () =>
    setLineItems((prev) => [...prev, { description: "", qty: 1, unitPrice: 0 }])
  const removeItem = (index: number) =>
    setLineItems((prev) => prev.filter((_, i) => i !== index))

  const save = async () => {
    setSaving(true)
    try {
      await dispatch(
        updateWorkOrder({
          id: workOrder.id,
          patch: {
            title,
            status,
            priority,
            serviceType,
            assignedMechanicId: assignee === UNASSIGNED ? null : assignee,
            lineItems: lineItems.filter((item) => item.description.trim()),
          },
        })
      ).unwrap()
      toast.success(`${workOrder.number} updated`)
      onOpenChange(false)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>
            <span className="data-id text-muted-foreground">
              {workOrder.number}
            </span>{" "}
            Edit work order
          </SheetTitle>
          <SheetDescription>
            Changes save to the order and its estimate.
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="wo-title">Job</Label>
            <Input
              id="wo-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <Label>Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as WorkOrderStatus)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((s) => (
                    <SelectItem key={s} value={s}>
                      {workOrderStatusLabels[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Priority</Label>
              <Select
                value={priority}
                onValueChange={(value) =>
                  setPriority(value as WorkOrderPriority)
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((p) => (
                    <SelectItem key={p} value={p} className="capitalize">
                      {p}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Service type</Label>
              <Select
                value={serviceType}
                onValueChange={(value) => setServiceType(value as ServiceType)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {serviceTypeLabels[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label>Assignee</Label>
              <Select value={assignee} onValueChange={setAssignee}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                  {mechanics.map((mechanic) => (
                    <SelectItem key={mechanic.id} value={mechanic.id}>
                      {mechanic.name}
                      {mechanic.role === "owner" ? " (Owner)" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Line items</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addItem}
              >
                <Plus />
                Add
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {lineItems.map((item, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    aria-label="Description"
                    placeholder="Part or labor"
                    value={item.description}
                    onChange={(event) =>
                      setItem(index, { description: event.target.value })
                    }
                    className="flex-1"
                  />
                  <Input
                    aria-label="Quantity"
                    type="number"
                    min={1}
                    value={item.qty}
                    onChange={(event) =>
                      setItem(index, { qty: Number(event.target.value) })
                    }
                    className="w-16"
                  />
                  <Input
                    aria-label="Unit price"
                    type="number"
                    min={0}
                    value={item.unitPrice}
                    onChange={(event) =>
                      setItem(index, { unitPrice: Number(event.target.value) })
                    }
                    className="w-24"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label="Remove line item"
                    onClick={() => removeItem(index)}
                    className="text-muted-foreground hover:text-destructive shrink-0"
                  >
                    <Trash2 />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex items-baseline justify-between pt-1">
              <span className="text-muted-foreground text-sm">Estimate</span>
              <span className="text-lg font-semibold">
                {formatCurrency(total)}
              </span>
            </div>
          </div>
        </div>

        <SheetFooter>
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </Button>
          <SheetClose asChild>
            <Button variant="outline">Cancel</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
