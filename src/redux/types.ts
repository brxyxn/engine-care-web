export enum SliceStatus {
  IDLE = "idle",
  LOADING = "loading",
  SUCCEEDED = "succeeded",
  FAILED = "failed",
}

export type RootSlice<T> = {
  state: T | null
  status: SliceStatus
}
