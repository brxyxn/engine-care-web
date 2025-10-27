type SignUpFormState = {
  errors: {
    email?: string[]
    password?: string[]
    confirmPassword?: string[]
  }
  status: "success" | "error" | "idle"
}

type SignInFormState = {
  fields: {
    email?: string
    password?: string
  }
  errors: {
    email?: string[]
    password?: string[]
  }
  status: "success" | "error" | "idle"
}
