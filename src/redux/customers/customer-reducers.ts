import { customerInitialState } from "@/redux/customers/customer-initial-state"
import { CustomerSlice } from "@/redux/customers/customer-types"
import { createAction, createReducer } from "@reduxjs/toolkit"

const addCustomer = createAction("customers/addCustomer")

export const customerReducers = createReducer<CustomerSlice>(
  customerInitialState,
  (builder) => {
    builder.addCase(addCustomer, (state) => {
      state.state = {
        ...state.state,
        id: "new-id",
        name: "New Customer",
        email: "customer@enginecare.app",
      }
    })
  }
)
