/** Subscription tier for a shop. Drives capability defaults (no billing yet). */
type PlanTier = "individual" | "team" | "enterprise"

type Session = {
  user: {
    id: string
    name: string
    role: StaffRole
    avatarUrl: string
  }
  shop: {
    id: string
    name: string
    plan: PlanTier
  }
}
