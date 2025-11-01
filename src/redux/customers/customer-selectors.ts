import { CustomerSlice } from "@/redux/customers/customer-types"
import { RootState } from "@/redux/store"
import { createSelector } from "@reduxjs/toolkit"

export const selectCustomers = (s: RootState) => s.customers

export const selectAllCustomers = createSelector(
  selectCustomers,
  (customers: CustomerSlice) => customers.state
)
