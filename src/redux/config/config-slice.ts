import { configInitialState } from "@/redux/config/config-initial-state"
import { createAppSlice } from "@/redux/create-app-slice"

export const configSlice = createAppSlice({
  name: "configs",
  initialState: configInitialState,
  reducers: (create) => ({
    setConfig: create.reducer((state) => {
      state.state = {
        user: {
          id: "new-id",
          name: "New Customer",
          email: "",
          avatar: "",
        },
      } as UserConfig
    }),
  }),
  selectors: {
    selectConfig: (counter) => counter.state,
    selectConfigStatus: (counter) => counter.status,
  },
})

export const { setConfig } = configSlice.actions

export const { selectConfig, selectConfigStatus } = configSlice.selectors
