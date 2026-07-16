"use client"

import { useEffect } from "react"
import {
  selectAppointments,
  selectAppointmentsStatus,
} from "@/redux/appointments/appointments-slice"
import { fetchAppointments } from "@/redux/appointments/appointments-thunks"
import {
  selectCustomers,
  selectCustomerStatus,
} from "@/redux/customers/customer-slice"
import { fetchCustomers } from "@/redux/customers/customer-thunks"
import {
  selectDashboardActivity,
  selectDashboardStats,
  selectDashboardStatus,
  selectServiceStats,
} from "@/redux/dashboard/dashboard-slice"
import {
  fetchDashboardActivity,
  fetchDashboardStats,
  fetchServiceStats,
} from "@/redux/dashboard/dashboard-thunks"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import {
  selectInvoices,
  selectInvoicesStatus,
} from "@/redux/invoices/invoices-slice"
import { fetchInvoices } from "@/redux/invoices/invoices-thunks"
import { selectReminders } from "@/redux/notifications/notifications-slice"
import { fetchReminders } from "@/redux/notifications/notifications-thunks"
import { selectStaff, selectStaffStatus } from "@/redux/staff/staff-slice"
import { fetchStaff } from "@/redux/staff/staff-thunks"
import {
  selectVehicles,
  selectVehiclesStatus,
} from "@/redux/vehicles/vehicles-slice"
import { fetchVehicles } from "@/redux/vehicles/vehicles-thunks"
import {
  selectWorkOrders,
  selectWorkOrdersStatus,
} from "@/redux/work-orders/work-orders-slice"
import { fetchWorkOrders } from "@/redux/work-orders/work-orders-thunks"

/**
 * Screen data hooks: fetch on mount (mock data is cheap and may be stale in
 * the persisted store), expose current state + status for skeletons.
 */

export function useCustomers() {
  const dispatch = useAppDispatch()
  const customers = useAppSelector(selectCustomers)
  const status = useAppSelector(selectCustomerStatus)
  useEffect(() => {
    dispatch(fetchCustomers())
  }, [dispatch])
  return { customers, status }
}

export function useVehicles() {
  const dispatch = useAppDispatch()
  const vehicles = useAppSelector(selectVehicles)
  const status = useAppSelector(selectVehiclesStatus)
  useEffect(() => {
    dispatch(fetchVehicles())
  }, [dispatch])
  return { vehicles, status }
}

export function useWorkOrders() {
  const dispatch = useAppDispatch()
  const workOrders = useAppSelector(selectWorkOrders)
  const status = useAppSelector(selectWorkOrdersStatus)
  useEffect(() => {
    dispatch(fetchWorkOrders())
  }, [dispatch])
  return { workOrders, status }
}

export function useAppointments() {
  const dispatch = useAppDispatch()
  const appointments = useAppSelector(selectAppointments)
  const status = useAppSelector(selectAppointmentsStatus)
  useEffect(() => {
    dispatch(fetchAppointments())
  }, [dispatch])
  return { appointments, status }
}

export function useInvoices() {
  const dispatch = useAppDispatch()
  const invoices = useAppSelector(selectInvoices)
  const status = useAppSelector(selectInvoicesStatus)
  useEffect(() => {
    dispatch(fetchInvoices())
  }, [dispatch])
  return { invoices, status }
}

export function useStaff() {
  const dispatch = useAppDispatch()
  const staff = useAppSelector(selectStaff)
  const status = useAppSelector(selectStaffStatus)
  useEffect(() => {
    dispatch(fetchStaff())
  }, [dispatch])
  return { staff, status }
}

export function useDashboard() {
  const dispatch = useAppDispatch()
  const stats = useAppSelector(selectDashboardStats)
  const activity = useAppSelector(selectDashboardActivity)
  const serviceStats = useAppSelector(selectServiceStats)
  const status = useAppSelector(selectDashboardStatus)
  useEffect(() => {
    dispatch(fetchDashboardStats())
    dispatch(fetchDashboardActivity())
    dispatch(fetchServiceStats())
  }, [dispatch])
  return { stats, activity, serviceStats, status }
}

export function useReminders() {
  const dispatch = useAppDispatch()
  const reminders = useAppSelector(selectReminders)
  useEffect(() => {
    dispatch(fetchReminders())
  }, [dispatch])
  return { reminders }
}
