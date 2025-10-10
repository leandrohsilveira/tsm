import { loginEndpoint } from "@/api/auth/login.js"
import { emitter, Input, pending, PropsWithChildren } from "@jsxrx/core"
import { map, Observable } from "rxjs"
import Button from "../ui/Button.js"
import FormField from "../ui/FormField.js"
import { AuthLoginContext } from "@/contexts/auth/login.js"

type LoginProps = PropsWithChildren

export default function Login($: Observable<LoginProps>) {
  const input$ = Input.from($)

  const { children } = input$.take()

  const loginAction = loginEndpoint.action()

  const authContext$ = input$.context.require(AuthLoginContext)
  const authReloadEmitter$ = emitter(authContext$.pipe(map(ctx => ctx.reload)))

  const isLoggedIn$ = authContext$.pipe(map(context => context.isLoggedIn))
  const isLoggingIn$ = pending(loginAction)

  async function handleSubmit(e: JsxRx.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    await loginAction.perform({
      username: formData.get("username") as string,
      password: formData.get("password") as string,
    })
    await authReloadEmitter$.emit()
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
