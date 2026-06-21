import { emitter, Props } from "@jsxrx/core"
import { lastValueFrom, Observable, take } from "rxjs"
import Button from "../ui/Button.js"
import FormField from "../ui/FormField.js"
import { ResolvedProps, RouteResolverInput } from "@jsxrx/router"
import { loginEndpoint } from "@/api/auth/login.js"

type LoginProps = {
  isSubmitting?: boolean
  onSubmit(formData: FormData): void
}

export function LoginResolver({
  navigate,
  url$,
}: RouteResolverInput): ResolvedProps<LoginProps> {
  const loginAction = loginEndpoint.action()

  return {
    isSubmitting: loginAction.pending$,
    async onSubmit(formData) {
      await loginAction.perform({
        username: formData.get("username") as string,
        password: formData.get("password") as string,
      })
      const url = await lastValueFrom(url$.pipe(take(1)))
      navigate(url.searchParams.get("next") || "/")
    },
  }
}

export default function Login(input$: Observable<LoginProps>) {
  const { isSubmitting$, onSubmit$ } = Props.take(input$, {
    isSubmitting: false,
  })

  const submitEmitter = emitter(onSubmit$)

  function handleSubmit(e: JsxRx.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const formData = new FormData(e.target as HTMLFormElement)

    submitEmitter.emit(formData)
  }

  return (
    <main className="h-svh w-full flex items-center justify-center">
      <form
        className="flex flex-col w-full items-center max-w-96 p-2 gap-4"
        onSubmit={handleSubmit}
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
          disabled={isSubmitting$}
        >
          Sign in
        </Button>
      </form>
    </main>
  )
}
