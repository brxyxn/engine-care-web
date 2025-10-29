import { CustomerSlice } from "@/redux/customers/customer-types"
import { SliceStatus } from "@/redux/types"
import { createAsyncThunk } from "@reduxjs/toolkit"

export const fetchCustomers = createAsyncThunk<CustomerSlice>(
  "customers/fetchCustomers",
  async () => {
    // Simulate an API call to fetch customers
    return await new Promise<CustomerSlice>((resolve) =>
      setTimeout(
        () =>
          resolve({
            state: { id: "new-id", name: "My Name", email: "" },
            status: SliceStatus.SUCCEEDED,
          }),
        1000
      )
    )
  }
)
