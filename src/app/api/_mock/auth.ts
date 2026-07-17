import { sessions } from "@/app/api/_mock/db"
import { nextId, store } from "@/app/api/_mock/store"

/**
 * Mock auth registry. In the real system the Go backend owns password hashing
 * and issues a signed token; here a plaintext demo table maps emails to
 * sessions, and the session cookie stores the user id. Signups append to the
 * registry so a freshly created account can log in within the server session.
 */
type Credential = {
  email: string
  password: string
  session: Session
}

export const SESSION_COOKIE = "ec_session"

const globalForAuth = globalThis as unknown as {
  __ecCredentials?: Credential[]
}

const registry: Credential[] =
  globalForAuth.__ecCredentials ??
  (globalForAuth.__ecCredentials = [
    {
      email: "ray@enginecare.app",
      password: "engine123",
      session: sessions.owner,
    },
    {
      email: "sarah@enginecare.app",
      password: "engine123",
      session: sessions.mechanic,
    },
  ])

export const findByCredentials = (email: string, password: string) =>
  registry.find(
    (c) =>
      c.email.toLowerCase() === email.toLowerCase() && c.password === password
  )?.session ?? null

export const findByUserId = (userId: string): Session | null =>
  registry.find((c) => c.session.user.id === userId)?.session ?? null

export const emailTaken = (email: string) =>
  registry.some((c) => c.email.toLowerCase() === email.toLowerCase())

/** Create a shop owner account: adds a staff member + a login credential. */
export const createOwnerAccount = (input: {
  name: string
  email: string
  password: string
  shopName: string
}): Session => {
  const userId = nextId("stf")
  const staffMember: StaffMember = {
    id: userId,
    name: input.name,
    role: "owner",
    title: "Owner",
    avatarUrl: "",
    activeTasks: 0,
    capacity: 0,
    completedMtd: 0,
    revenueMtd: 0,
  }
  store.staff.push(staffMember)

  const session: Session = {
    user: { id: userId, name: input.name, role: "owner", avatarUrl: "" },
    // Fresh sign-ups start solo on the free Individual plan.
    shop: { id: nextId("shop"), name: input.shopName, plan: "individual" },
  }
  registry.push({ email: input.email, password: input.password, session })
  return session
}
