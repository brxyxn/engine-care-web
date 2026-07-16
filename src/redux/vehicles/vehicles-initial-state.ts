import { SliceStatus } from "@/redux/types"
import { VehiclesSlice } from "@/redux/vehicles/vehicles-types"

export const vehiclesInitialState: VehiclesSlice = {
  state: null,
  status: SliceStatus.IDLE,
}
