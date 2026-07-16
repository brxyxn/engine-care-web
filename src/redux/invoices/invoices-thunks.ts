import { api } from "@/lib/api"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchInvoices = createAsyncThunk("invoices/fetch", async () =>
  api.get<Invoice[]>("/invoices")
)
