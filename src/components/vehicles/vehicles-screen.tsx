"use client"

import { useState } from "react"
import { AddVehicleDialog } from "@/components/vehicles/add-vehicle-dialog"
import { VehicleCard } from "@/components/vehicles/vehicle-card"
import { KpiCard } from "@/components/shared/kpi-card"
import { PageHeader } from "@/components/shared/page-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { useCustomers, useVehicles, useWorkOrders } from "@/hooks/use-data"
import { formatCurrency, vehicleStatusLabels } from "@/lib/format"
import { useAppDispatch } from "@/redux/hooks"
import { deleteVehicle } from "@/redux/vehicles/vehicles-thunks"
import { Car, CircleCheck, Plus, Search, Wrench } from "lucide-react"
import { toast } from "sonner"

const vehicleStatuses: VehicleStatus[] = [
  "active",
  "in_shop",
  "ready",
  "for_sale",
]

export function VehiclesScreen() {
  const dispatch = useAppDispatch()
  const { vehicles } = useVehicles()
  const { customers } = useCustomers()
  const { workOrders } = useWorkOrders()

  const [query, setQuery] = useState("")
  const [make, setMake] = useState("all")
  const [status, setStatus] = useState("all")

  if (!vehicles) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader title="Vehicles" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  const customerById = new Map((customers ?? []).map((c) => [c.id, c]))
  const makes = [...new Set(vehicles.map((v) => v.make))].sort()

  const inShop = vehicles.filter((v) => v.status === "in_shop").length
  const completedOrders = (workOrders ?? []).filter(
    (wo) => wo.status === "delivered" || wo.status === "ready"
  )
  const servicedMtd = completedOrders.length
  const avgTicket =
    completedOrders.length > 0
      ? completedOrders.reduce((sum, wo) => sum + wo.estimateTotal, 0) /
        completedOrders.length
      : 0

  const q = query.trim().toLowerCase()
  const filtered = vehicles.filter((vehicle) => {
    if (make !== "all" && vehicle.make !== make) return false
    if (status !== "all" && vehicle.status !== status) return false
    if (
      q &&
      !`${vehicle.make} ${vehicle.model} ${vehicle.vin} ${vehicle.licensePlate}`
        .toLowerCase()
        .includes(q)
    ) {
      return false
    }
    return true
  })

  const onDelete = async (vehicle: Vehicle) => {
    await dispatch(deleteVehicle(vehicle.id)).unwrap()
    toast.success("Vehicle deleted", {
      description: `${vehicle.make} ${vehicle.model} removed from the registry.`,
    })
  }

  const addTrigger = (
    <Button>
      <Plus />
      Add vehicle
    </Button>
  )

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Vehicles"
        description="Every car your shop knows about"
        actions={
          <AddVehicleDialog customers={customers ?? []} trigger={addTrigger} />
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={<Car />}
          label="Total Vehicles"
          value={String(vehicles.length)}
        />
        <KpiCard
          icon={<Wrench />}
          label="In Shop"
          value={String(inShop)}
          badge={`${Math.round((inShop / Math.max(vehicles.length, 1)) * 100)}% of registry`}
        />
        <KpiCard
          icon={<CircleCheck />}
          label="Serviced"
          value={String(servicedMtd)}
          badge="ready or delivered"
          badgeTone="positive"
        />
        <KpiCard
          icon={<Car />}
          label="Avg Service Value"
          value={formatCurrency(avgTicket)}
        />
      </div>

      <Card className="flex-row flex-wrap items-center gap-3 p-3">
        <div className="relative min-w-56 flex-1">
          <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by make, model, VIN, or plate"
            className="bg-muted/50 rounded-full border-none pl-9"
          />
        </div>
        <Select value={make} onValueChange={setMake}>
          <SelectTrigger className="w-36 rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Make: All</SelectItem>
            {makes.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-36 rounded-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Status: All</SelectItem>
            {vehicleStatuses.map((s) => (
              <SelectItem key={s} value={s}>
                {vehicleStatusLabels[s]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {filtered.map((vehicle) => (
          <VehicleCard
            key={vehicle.id}
            vehicle={vehicle}
            owner={
              vehicle.customerId
                ? (customerById.get(vehicle.customerId) ?? null)
                : null
            }
            onDelete={onDelete}
          />
        ))}

        <AddVehicleDialog
          customers={customers ?? []}
          trigger={
            <button
              type="button"
              className="border-primary/40 text-muted-foreground hover:border-primary hover:text-foreground flex min-h-64 flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors"
            >
              <span className="bg-primary/12 text-primary flex size-12 items-center justify-center rounded-full">
                <Plus className="size-6" />
              </span>
              <span className="font-medium">Add new listing</span>
              <span className="max-w-48 text-center text-xs">
                Create a vehicle record manually or import via VIN
              </span>
            </button>
          }
        />
      </div>

      {filtered.length === 0 && (
        <p className="text-muted-foreground py-6 text-center text-sm">
          No vehicles match your search. Clear a filter or add the vehicle.
        </p>
      )}
    </div>
  )
}
