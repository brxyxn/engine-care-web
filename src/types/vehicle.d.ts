type VehicleStatus = "active" | "in_shop" | "ready" | "for_sale"

type Vehicle = {
  id: string
  /** null = shop-owned (e.g. dealership stock listed for sale) */
  customerId: string | null
  make: string
  model: string
  year: number
  vin: string
  licensePlate: string
  mileage: number
  engine: string
  transmission: string
  fuelType: "gasoline" | "diesel" | "hybrid" | "electric"
  photoUrl: string
  status: VehicleStatus
  /** Dealership use case: asking price when listed for sale */
  listPrice: number | null
  lastServiceAt: string | null
}

type NewVehicleInput = {
  customerId: string
  make: string
  model: string
  year: number
  vin: string
  licensePlate: string
  mileage: number
  engine: string
  transmission: string
  fuelType: Vehicle["fuelType"]
}
