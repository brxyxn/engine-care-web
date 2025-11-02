import { Action, combineSlices, configureStore, ThunkAction, } from "@reduxjs/toolkit"
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE, } from "redux-persist"
import { logger } from "@/redux/middleware/logger"
import allSlices from "@/redux/slices"
import storage from "@/redux/storage"

const persistConfig = {
  key: "root",
  storage,
}

export const rootReducer = combineSlices(...allSlices)
export type RootState = ReturnType<typeof rootReducer>

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(logger),
})

export const persistor = persistStore(store)

export const makeStore = () => {
  return store
}

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore["dispatch"]
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>
