import axios, { AxiosError } from "axios"

/**
 * Client for the EngineCare API. Points at the local Next.js mock routes now;
 * swap the base URL (env var) when the Go backend is live. All endpoints use
 * the `{ success, data }` envelope documented in docs/api-contract.md.
 */
const client = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api",
})

type Envelope<T> = { success: boolean; data: T; error?: string }

const unwrap = <T>(envelope: Envelope<T>): T => {
  if (!envelope.success) {
    throw new Error(envelope.error ?? "Request failed")
  }
  return envelope.data
}

/** Surface the server's envelope error on non-2xx responses (401, 404, …). */
const request = async <T>(promise: Promise<{ data: Envelope<T> }>): Promise<T> => {
  try {
    return unwrap((await promise).data)
  } catch (error) {
    if (error instanceof AxiosError) {
      const envelope = error.response?.data as Envelope<T> | undefined
      if (envelope?.error) {
        throw new Error(envelope.error)
      }
    }
    throw error
  }
}

/**
 * Pull a human message off whatever a rejected thunk throws — a real Error, a
 * redux-toolkit SerializedError ({ message }), or anything else (fallback).
 */
export const getErrorMessage = (error: unknown, fallback: string): string => {
  if (error instanceof Error && error.message) {
    return error.message
  }
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as { message: unknown }).message === "string"
  ) {
    return (error as { message: string }).message
  }
  return fallback
}

export const api = {
  get: <T>(url: string, params?: Record<string, string>) =>
    request<T>(client.get<Envelope<T>>(url, { params })),
  post: <T>(url: string, body?: unknown) =>
    request<T>(client.post<Envelope<T>>(url, body)),
  patch: <T>(url: string, body?: unknown) =>
    request<T>(client.patch<Envelope<T>>(url, body)),
  delete: <T>(url: string) => request<T>(client.delete<Envelope<T>>(url)),
}
