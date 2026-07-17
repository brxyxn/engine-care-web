import { createAppSlice } from "@/redux/create-app-slice"
import { SliceStatus } from "@/redux/types"
import { vehiclesInitialState } from "@/redux/vehicles/vehicles-initial-state"
import {
  createVehicle,
  deleteVehicle,
  fetchVehicles,
  updateVehicle,
} from "@/redux/vehicles/vehicles-thunks"

export const vehiclesSlice = createAppSlice({
  name: "vehicles",
  initialState: vehiclesInitialState,
  reducers: () => ({}),
  extraReducers: (builder) => {
    builder
      .addCase(fetchVehicles.pending, (slice) => {
        slice.status = SliceStatus.LOADING
      })
      .addCase(fetchVehicles.fulfilled, (slice, action) => {
        slice.state = action.payload
        slice.status = SliceStatus.SUCCEEDED
      })
      .addCase(fetchVehicles.rejected, (slice) => {
        slice.status = SliceStatus.FAILED
      })
      .addCase(createVehicle.fulfilled, (slice, action) => {
        slice.state = [action.payload, ...(slice.state ?? [])]
      })
      .addCase(updateVehicle.fulfilled, (slice, action) => {
        slice.state =
          slice.state?.map((v) =>
            v.id === action.payload.id ? action.payload : v
          ) ?? null
      })
      .addCase(deleteVehicle.fulfilled, (slice, action) => {
        slice.state =
          slice.state?.filter((v) => v.id !== action.payload.id) ?? null
      })
  },
  selectors: {
    selectVehicles: (slice) => slice.state,
    selectVehiclesStatus: (slice) => slice.status,
  },
})

export const { selectVehicles, selectVehiclesStatus } = vehiclesSlice.selectors
