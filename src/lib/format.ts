const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
})

const currencyCompact = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
})

export const formatCurrency = (value: number) => currency.format(value)

export const formatCompactCurrency = (value: number) =>
  currencyCompact.format(value)

export const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

export const serviceTypeLabels: Record<ServiceType, string> = {
  engine_diagnostic: "Engine Diagnostic",
  brake_system: "Brake System",
  tire_rotation: "Tire Rotation",
  electrical: "Electrical",
  general_repair: "General Repair",
  inspection: "Inspection",
  maintenance: "Maintenance",
}

export const workOrderStatusLabels: Record<WorkOrderStatus, string> = {
  intake: "Intake",
  diagnostics: "Diagnostics",
  in_repair: "In Repair",
  waiting_parts: "Waiting Parts",
  ready: "Ready",
  delivered: "Delivered",
}

export const customerStatusLabels: Record<CustomerStatus, string> = {
  new: "New",
  follow_up: "Follow Up",
  active: "Active",
  archived: "Archived",
}

export const vehicleStatusLabels: Record<VehicleStatus, string> = {
  active: "Active",
  in_shop: "In Shop",
  ready: "Ready",
  for_sale: "For Sale",
}

export const appointmentTypeLabels: Record<AppointmentType, string> = {
  drop_off: "Drop-off",
  pickup: "Pickup",
  inspection: "Inspection",
  service: "Service",
}

export const interactionTypeLabels: Record<InteractionType, string> = {
  phone_call: "Phone Call",
  email: "Email",
  visit: "Visit",
  form_submitted: "Form Submitted",
  estimate_sent: "Estimate Sent",
  no_activity: "No Activity",
}
