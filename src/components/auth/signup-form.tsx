"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { AuthShell } from "@/components/auth/auth-shell"
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
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectSession } from "@/redux/session/session-slice"
import { signup } from "@/redux/session/session-thunks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const schema = z
  .object({
    name: z.string().min(2, "Enter your name"),
    shopName: z.string().min(2, "Enter your shop name"),
    email: z.email("Enter a valid email"),
    password: z.string().min(6, "At least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  })

type FormValues = z.infer<typeof schema>

export function SignupForm() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const session = useAppSelector(selectSession)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      shopName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  useEffect(() => {
    if (session) {
      router.replace("/")
    }
  }, [session, router])

  const onSubmit = async (values: FormValues) => {
    try {
      await dispatch(
        signup({
          name: values.name,
          email: values.email,
          password: values.password,
          shopName: values.shopName,
        })
      ).unwrap()
      toast.success("Shop created", {
        description: "Welcome to EngineCare.",
      })
      router.replace("/")
    } catch (error) {
      form.setError("email", {
        message:
          error instanceof Error
            ? error.message
            : "Could not create the account.",
      })
    }
  }

  return (
    <AuthShell
      title="Create your shop"
      subtitle="Set up EngineCare in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your name</FormLabel>
                  <FormControl>
                    <Input placeholder="Ray Delgado" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="shopName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shop name</FormLabel>
                  <FormControl>
                    <Input placeholder="EngineCare Garage" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@shop.com"
                    autoComplete="email"
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Creating…" : "Create shop"}
          </Button>
        </form>
      </Form>
    </AuthShell>
  )
}
