import { createAppSlice } from "@/redux/create-app-slice"
import { invoicesInitialState } from "@/redux/invoices/invoices-initial-state"
import { fetchInvoices } from "@/redux/invoices/invoices-thunks"
import { SliceStatus } from "@/redux/types"

export const invoicesSlice = createAppSlice({
  name: "invoices",
  initialState: invoicesInitialState,
  reducers: () => ({}),
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (slice) => {
        slice.status = SliceStatus.LOADING
      })
      .addCase(fetchInvoices.fulfilled, (slice, action) => {
        slice.state = action.payload
        slice.status = SliceStatus.SUCCEEDED
      })
      .addCase(fetchInvoices.rejected, (slice) => {
        slice.status = SliceStatus.FAILED
      })
  },
  selectors: {
    selectInvoices: (slice) => slice.state,
    selectInvoicesStatus: (slice) => slice.status,
  },
})

export const { selectInvoices, selectInvoicesStatus } = invoicesSlice.selectors
