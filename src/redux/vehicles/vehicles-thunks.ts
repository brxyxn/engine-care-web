import { api } from "@/lib/api"
import { VehicleFilters } from "@/redux/vehicles/vehicles-types"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchVehicles = createAsyncThunk(
  "vehicles/fetch",
  async (filters?: VehicleFilters) =>
    api.get<Vehicle[]>("/vehicles", filters as Record<string, string>)
)

export const createVehicle = createAsyncThunk(
  "vehicles/create",
  async (input: NewVehicleInput) => api.post<Vehicle>("/vehicles", input)
)

export const updateVehicle = createAsyncThunk(
  "vehicles/update",
  async ({ id, patch }: { id: string; patch: Partial<Vehicle> }) =>
    api.patch<Vehicle>(`/vehicles/${id}`, patch)
)

export const deleteVehicle = createAsyncThunk(
  "vehicles/delete",
  async (id: string) => api.delete<{ id: string }>(`/vehicles/${id}`)
)
