import { loginEndpoint } from "@/api/auth/login.js"
import { Props, PropsWithChildren } from "@jsxrx/core"
import { map, Observable, of } from "rxjs"
import Button from "../ui/Button.js"
import FormField from "../ui/FormField.js"

type LoginProps = PropsWithChildren

export default function Login(input$: Observable<LoginProps>) {
  const { children } = Props.take(input$)

  const loginMutation = loginEndpoint.mutation()

  const isLoggedIn$ = of(false)
  const isLoggingIn$ = loginMutation.state$.pipe(
    map(({ state }) => state === "pending"),
  )

  function handleSubmit(e: JsxRx.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    loginMutation.mutate({
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    })
  }

  return isLoggedIn$.pipe(
    map(isLoggedIn => {
      if (isLoggedIn) return children
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
              disabled={isLoggingIn$}
            >
              Sign in
            </Button>
          </form>
        </main>
      )
    }),
  )
}
