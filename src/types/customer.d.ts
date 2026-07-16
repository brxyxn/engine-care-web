type CustomerStatus = "new" | "follow_up" | "active" | "archived"

type InteractionType =
  | "phone_call"
  | "email"
  | "visit"
  | "form_submitted"
  | "estimate_sent"
  | "no_activity"

type Customer = {
  id: string
  name: string
  email: string
  phone: string
  avatarUrl: string
  status: CustomerStatus
  location: string
  tags: string[]
  lastInteraction: {
    type: InteractionType
    at: string
  } | null
  lifetimeValue: number
  vehicleIds: string[]
  createdAt: string
}

type NewCustomerInput = {
  name: string
  email: string
  phone: string
  location: string
}
