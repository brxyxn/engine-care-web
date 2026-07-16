import { api } from "@/lib/api"
import { CustomerFilters } from "@/redux/customers/customer-types"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchCustomers = createAsyncThunk(
  "customers/fetch",
  async (filters?: CustomerFilters) =>
    api.get<Customer[]>("/customers", filters as Record<string, string>)
)

export const createCustomer = createAsyncThunk(
  "customers/create",
  async (input: NewCustomerInput) => api.post<Customer>("/customers", input)
)
