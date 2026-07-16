import { RootSlice } from "@/redux/types"

export type VehicleFilters = {
  status?: VehicleStatus
  make?: string
  q?: string
}

export type VehiclesSlice = RootSlice<Vehicle[]>
