"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { serviceTypeLabels } from "@/lib/format"
import { useAppDispatch } from "@/redux/hooks"
import { createWorkOrder } from "@/redux/work-orders/work-orders-thunks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const serviceTypes = Object.keys(serviceTypeLabels) as ServiceType[]

const schema = z.object({
  title: z.string().min(3, "Describe the job"),
  customerId: z.string().min(1, "Pick the customer"),
  vehicleId: z.string().min(1, "Pick the vehicle"),
  serviceType: z.enum(
    serviceTypes as [ServiceType, ...ServiceType[]]
  ),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  estimateTotal: z.coerce.number<number>().min(0),
})

type FormValues = z.infer<typeof schema>

export type CreateWorkOrderDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
  vehicles: Vehicle[]
}

export function CreateWorkOrderDialog({
  open,
  onOpenChange,
  customers,
  vehicles,
}: CreateWorkOrderDialogProps) {
  const dispatch = useAppDispatch()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      customerId: "",
      vehicleId: "",
      serviceType: "general_repair",
      priority: "normal",
      estimateTotal: 0,
    },
  })

  const customerId = form.watch("customerId")
  const customerVehicles = customerId
    ? vehicles.filter((v) => v.customerId === customerId)
    : vehicles

  const onSubmit = async (values: FormValues) => {
    const created = await dispatch(createWorkOrder(values)).unwrap()
    toast.success(`${created.number} created`, {
      description: "It starts in Intake — drag it forward as work begins.",
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New work order</DialogTitle>
          <DialogDescription>
            Starts in Intake with the estimate attached.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Front brake pads + rotors"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="customerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Customer</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customers.map((customer) => (
                          <SelectItem key={customer.id} value={customer.id}>
                            {customer.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vehicleId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {customerVehicles.map((vehicle) => (
                          <SelectItem key={vehicle.id} value={vehicle.id}>
                            {vehicle.make} {vehicle.model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service type</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {serviceTypeLabels[type]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="priority"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Priority</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="urgent">Urgent</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="estimateTotal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimate (USD)</FormLabel>
                  <FormControl>
                    <Input type="number" min={0} step={10} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="submit"
                disabled={form.formState.isSubmitting}
                className="w-full"
              >
                {form.formState.isSubmitting
                  ? "Creating…"
                  : "Create work order"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
