import { createAppSlice } from "@/redux/create-app-slice"
import { PayloadAction } from "@reduxjs/toolkit"

export interface UiSliceState {
  // Controls the app-wide "New work order" Sheet, opened from the sidebar,
  // the mobile FAB, or the Work Orders header — from any route.
  createWorkOrderOpen: boolean
}

const initialState: UiSliceState = {
  createWorkOrderOpen: false,
}

export const uiSlice = createAppSlice({
  name: "ui",
  initialState,
  reducers: (create) => ({
    openCreateWorkOrder: create.reducer((state) => {
      state.createWorkOrderOpen = true
    }),
    closeCreateWorkOrder: create.reducer((state) => {
      state.createWorkOrderOpen = false
    }),
    setCreateWorkOrderOpen: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.createWorkOrderOpen = action.payload
      }
    ),
  }),
  selectors: {
    selectCreateWorkOrderOpen: (ui) => ui.createWorkOrderOpen,
  },
})

export const { openCreateWorkOrder, closeCreateWorkOrder, setCreateWorkOrderOpen } =
  uiSlice.actions

export const { selectCreateWorkOrderOpen } = uiSlice.selectors
