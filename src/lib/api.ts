import axios from "axios"

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

export const api = {
  get: async <T>(url: string, params?: Record<string, string>) =>
    unwrap((await client.get<Envelope<T>>(url, { params })).data),
  post: async <T>(url: string, body?: unknown) =>
    unwrap((await client.post<Envelope<T>>(url, body)).data),
  patch: async <T>(url: string, body?: unknown) =>
    unwrap((await client.patch<Envelope<T>>(url, body)).data),
  delete: async <T>(url: string) =>
    unwrap((await client.delete<Envelope<T>>(url)).data),
}
