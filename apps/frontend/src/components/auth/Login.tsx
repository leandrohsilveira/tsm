import { Input } from "@jsxrx/core"
import { map, Observable } from "rxjs"
import Button from "../ui/Button.js"
import FormField from "../ui/FormField.js"
import { ResolvedProps } from "@jsxrx/router"
import { loginEndpoint } from "@/api/auth/login.js"

type LoginProps = {
  isSubmitting?: boolean
  onSubmit(formData: FormData): void
}

export function LoginResolver(): ResolvedProps<LoginProps> {
  const loginAction = loginEndpoint.action()

  return {
    isSubmitting: loginAction.pending$,
    async onSubmit(formData) {
      await loginAction.perform({
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      })
    },
  }
}

export default function Login($: Observable<LoginProps>) {
  const input$ = Input.from($)

  const { isSubmitting, onSubmit } = input$.take({ isSubmitting: false })

  return (
    <main className="h-svh w-full flex items-center justify-center">
      <form
        className="flex flex-col w-full items-center max-w-96 p-2 gap-4"
        onSubmit={onSubmit.pipe(
          map(handleSubmit => e => {
            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement)
            handleSubmit(formData)
          }),
        )}
      >
        <h1 className="text-accent-700">Login</h1>
        <FormField for="username" label="E-mail">
          <input
            type="email"
            id="username"
            name="username"
            placeholder="Enter the e-mail"
            autoComplete="username"
          />
        </FormField>
        <FormField for="password" label="Password">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            autoComplete="current-password"
          />
        </FormField>
        <Button
          type="submit"
          color="accent"
          className="w-full"
          disabled={isSubmitting}
        >
          Sign in
        </Button>
      </form>
    </main>
  )
}
