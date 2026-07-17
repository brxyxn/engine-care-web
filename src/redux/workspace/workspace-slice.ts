import { createAppSlice } from "@/redux/create-app-slice"
import { PayloadAction } from "@reduxjs/toolkit"

export interface WorkspaceSliceState {
  // Owner opt-in for team/enterprise plans: also work as a mechanic (be
  // assignable and get the mechanic workbench). On the individual plan the
  // owner always works as a mechanic regardless of this flag.
  ownerWorksAsMechanic: boolean
}

const initialState: WorkspaceSliceState = {
  ownerWorksAsMechanic: false,
}

export const workspaceSlice = createAppSlice({
  name: "workspace",
  initialState,
  reducers: (create) => ({
    setOwnerWorksAsMechanic: create.reducer(
      (state, action: PayloadAction<boolean>) => {
        state.ownerWorksAsMechanic = action.payload
      }
    ),
  }),
  selectors: {
    selectOwnerWorksAsMechanicSetting: (ws) => ws.ownerWorksAsMechanic,
  },
})

export const { setOwnerWorksAsMechanic } = workspaceSlice.actions

export const { selectOwnerWorksAsMechanicSetting } = workspaceSlice.selectors
