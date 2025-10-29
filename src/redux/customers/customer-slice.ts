import { createAppSlice } from "@/redux/create-app-slice"
import { initialState } from "@/redux/customers/initial-state"

// If you are not using async thunks you can use the standalone `createSlice`.
export const customerSlice = createAppSlice({
  name: "customers",
  initialState,
  reducers: (create) => ({
    addCustomer: create.reducer((state) => {
      state.state = {
        id: "new-id",
        name: "New Customer",
        email: "",
      }
    }),
    setCustomers: create.reducer((state) => {
      state.state = {
        id: "new-id",
        name: "New Customer",
        email: "",
      }
    }),
  }),
  selectors: {
    selectCustomers: (counter) => counter.state,
    selectCustomerID: (counter) => counter.status,
  },
})

// Action creators are generated for each case reducer function.
export const { setCustomers } = customerSlice.actions

// Selectors returned by `slice.selectors` take the root state as their first argument.
export const { selectCustomers } = customerSlice.selectors
