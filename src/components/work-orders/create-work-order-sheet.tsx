"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
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
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { serviceTypeLabels } from "@/lib/format"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectSession } from "@/redux/session/session-slice"
import { createWorkOrder } from "@/redux/work-orders/work-orders-thunks"
import { selectOwnersWorkAsMechanics } from "@/redux/workspace/workspace-capabilities"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const serviceTypes = Object.keys(serviceTypeLabels) as ServiceType[]
const UNASSIGNED = "unassigned"

const schema = z.object({
  title: z.string().min(3, "Describe the job"),
  customerId: z.string().min(1, "Pick the customer"),
  vehicleId: z.string().min(1, "Pick the vehicle"),
  serviceType: z.enum(serviceTypes as [ServiceType, ...ServiceType[]]),
  priority: z.enum(["low", "normal", "high", "urgent"]),
  estimateTotal: z.coerce.number<number>().min(0),
  assignedMechanicId: z.string(),
})

type FormValues = z.infer<typeof schema>

export type CreateWorkOrderSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  customers: Customer[]
  vehicles: Vehicle[]
  staff: StaffMember[]
}

export function CreateWorkOrderSheet({
  open,
  onOpenChange,
  customers,
  vehicles,
  staff,
}: CreateWorkOrderSheetProps) {
  const dispatch = useAppDispatch()
  const session = useAppSelector(selectSession)
  const ownersWork = useAppSelector(selectOwnersWorkAsMechanics)

  // Owners who work as mechanics can be assigned; default a working owner's own
  // new orders to themselves so a solo owner is ready to work immediately.
  const assignable = staff.filter(
    (s) => s.role === "mechanic" || (ownersWork && s.role === "owner")
  )
  const defaultAssignee =
    ownersWork && session?.user.role === "owner"
      ? session.user.id
      : UNASSIGNED

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      customerId: "",
      vehicleId: "",
      serviceType: "general_repair",
      priority: "normal",
      estimateTotal: 0,
      assignedMechanicId: defaultAssignee,
    },
  })

  const customerId = form.watch("customerId")
  const customerVehicles = customerId
    ? vehicles.filter((v) => v.customerId === customerId)
    : vehicles

  const onSubmit = async (values: FormValues) => {
    const { assignedMechanicId, ...rest } = values
    const created = await dispatch(
      createWorkOrder({
        ...rest,
        assignedMechanicId:
          assignedMechanicId === UNASSIGNED ? undefined : assignedMechanicId,
      })
    ).unwrap()
    toast.success(`${created.number} created`, {
      description: "It starts in Intake — drag it forward as work begins.",
    })
    form.reset()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>New work order</SheetTitle>
          <SheetDescription>
            Starts in Intake with the estimate attached.
          </SheetDescription>
        </SheetHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-1 flex-col gap-4 px-4 pb-4"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job</FormLabel>
                  <FormControl>
                    <Input placeholder="Front brake pads + rotors" {...field} />
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

            {ownersWork && (
              <FormField
                control={form.control}
                name="assignedMechanicId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assign to</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                        {assignable.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                            {member.role === "owner" ? " (Owner)" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <SheetFooter className="mt-auto px-0">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Creating…" : "Create work order"}
              </Button>
              <SheetClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </SheetClose>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
