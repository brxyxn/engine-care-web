import { InvoicesSlice } from "@/redux/invoices/invoices-types"
import { SliceStatus } from "@/redux/types"

export const invoicesInitialState: InvoicesSlice = {
  state: null,
  status: SliceStatus.IDLE,
}
