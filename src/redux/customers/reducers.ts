import { initialState } from "@/redux/customers/initial-state"
import { CustomerSlice } from "@/redux/customers/types"
import { createAction, createReducer } from "@reduxjs/toolkit"

const addCustomer = createAction("customers/addCustomer")

export const customerReducers = createReducer<CustomerSlice>(
  initialState,
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
