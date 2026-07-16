"use client"

import { StatusBadge, StatusTone } from "@/components/shared/status-badge"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatCurrency, vehicleStatusLabels } from "@/lib/format"
import { Car, Cog, Fuel, Gauge, Hash, Trash2, Zap } from "lucide-react"

const statusTones: Record<VehicleStatus, StatusTone> = {
  active: "muted",
  in_shop: "info",
  ready: "success",
  for_sale: "accent",
}

export type VehicleCardProps = {
  vehicle: Vehicle
  owner: Customer | null
  onDelete: (vehicle: Vehicle) => void
}

export function VehicleCard({ vehicle, owner, onDelete }: VehicleCardProps) {
  return (
    <Card className="overflow-hidden pt-0">
      <div className="from-secondary to-card relative flex h-36 items-center justify-center bg-gradient-to-b">
        <Car
          className="text-muted-foreground/40 size-16"
          strokeWidth={1.25}
        />
        <div className="absolute top-3 left-3">
          <StatusBadge tone={statusTones[vehicle.status]}>
            {vehicleStatusLabels[vehicle.status]}
          </StatusBadge>
        </div>
        <span className="data-id text-muted-foreground absolute right-3 bottom-2">
          {vehicle.licensePlate}
        </span>
      </div>
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="leading-tight font-semibold">
              {vehicle.make} {vehicle.model}
            </h3>
            <p className="text-muted-foreground text-sm">
              {owner ? owner.name : "Shop inventory"}
            </p>
          </div>
          <span className="text-muted-foreground text-sm">{vehicle.year}</span>
        </div>

        {vehicle.status === "for_sale" && vehicle.listPrice !== null && (
          <p className="text-2xl font-semibold tracking-tight">
            {formatCurrency(vehicle.listPrice)}
          </p>
        )}

        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
          <SpecRow icon={<Gauge />} label={`${vehicle.mileage.toLocaleString()} mi`} />
          <SpecRow
            icon={vehicle.fuelType === "electric" ? <Zap /> : <Fuel />}
            label={vehicle.engine}
          />
          <SpecRow icon={<Cog />} label={vehicle.transmission} />
          <SpecRow
            icon={<Hash />}
            label={
              <span className="data-id">
                {vehicle.vin.slice(0, 6)}…{vehicle.vin.slice(-4)}
              </span>
            }
          />
        </dl>

        <div className="flex gap-2">
          <Button className="flex-1" size="sm">
            Edit
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Delete {vehicle.make} {vehicle.model}?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This removes the vehicle and its service history from the
                  registry. Work orders that reference it stay on file.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep vehicle</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(vehicle)}
                  className="bg-destructive text-white hover:bg-destructive/90"
                >
                  Delete vehicle
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}

function SpecRow({
  icon,
  label,
}: {
  icon: React.ReactNode
  label: React.ReactNode
}) {
  return (
    <div className="text-muted-foreground flex items-center gap-1.5 [&_svg]:size-3.5 [&_svg]:shrink-0">
      {icon}
      <span className="text-foreground/80 truncate">{label}</span>
    </div>
  )
}
