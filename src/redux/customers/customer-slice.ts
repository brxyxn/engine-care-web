import { createAppSlice } from "@/redux/create-app-slice"
import { customerInitialState } from "@/redux/customers/customer-initial-state"
import {
  createCustomer,
  fetchCustomers,
} from "@/redux/customers/customer-thunks"
import { SliceStatus } from "@/redux/types"

export const customerSlice = createAppSlice({
  name: "customers",
  initialState: customerInitialState,
  reducers: () => ({}),
  extraReducers: (builder) => {
    builder
      .addCase(fetchCustomers.pending, (slice) => {
        slice.status = SliceStatus.LOADING
      })
      .addCase(fetchCustomers.fulfilled, (slice, action) => {
        slice.state = action.payload
        slice.status = SliceStatus.SUCCEEDED
      })
      .addCase(fetchCustomers.rejected, (slice) => {
        slice.status = SliceStatus.FAILED
      })
      .addCase(createCustomer.fulfilled, (slice, action) => {
        slice.state = [action.payload, ...(slice.state ?? [])]
      })
  },
  selectors: {
    selectCustomers: (slice) => slice.state,
    selectCustomerStatus: (slice) => slice.status,
  },
})

export const { selectCustomers, selectCustomerStatus } = customerSlice.selectors
