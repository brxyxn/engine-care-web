import { RootSlice } from "@/redux/types"

export type CustomerFilters = {
  status?: CustomerStatus
  q?: string
}

export type CustomerSlice = RootSlice<Customer[]>
