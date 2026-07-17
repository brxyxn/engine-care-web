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
import { getErrorMessage } from "@/lib/api"
import { useAppDispatch, useAppSelector } from "@/redux/hooks"
import { selectSession } from "@/redux/session/session-slice"
import { login } from "@/redux/session/session-thunks"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

const schema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string().min(1, "Enter your password"),
})

type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const session = useAppSelector(selectSession)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", password: "" },
  })

  // Already signed in → skip the form
  useEffect(() => {
    if (session) {
      router.replace("/")
    }
  }, [session, router])

  const onSubmit = async (values: FormValues) => {
    try {
      await dispatch(login(values)).unwrap()
      toast.success("Welcome back")
      router.replace("/")
    } catch (error) {
      form.setError("password", {
        message: getErrorMessage(error, "Could not sign in. Try again."),
      })
    }
  }

  const fillDemo = (email: string) => {
    form.setValue("email", email)
    form.setValue("password", "engine123")
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Welcome back to your shop."
      footer={
        <>
          New to EngineCare?{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
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
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="w-full"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </Form>

      <div className="bg-muted/40 rounded-xl p-3 text-xs">
        <p className="text-muted-foreground mb-2">Try a demo account:</p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fillDemo("ray@enginecare.app")}
            className="border-border hover:border-primary rounded-full border px-2.5 py-1"
          >
            Owner
          </button>
          <button
            type="button"
            onClick={() => fillDemo("sarah@enginecare.app")}
            className="border-border hover:border-primary rounded-full border px-2.5 py-1"
          >
            Mechanic
          </button>
        </div>
      </div>
    </AuthShell>
  )
}
