import { Component, component, defer, PropsWithChildren } from "@jsxrx/core"
import FormField from "../ui/FormField.js"
import Button from "../ui/Button.js"
import { loginEndpoint } from "@/api/auth/login.js"
import { map } from "rxjs"

export default component({
  name: "Login",
  pipe() {
    const loginMutation = loginEndpoint.mutation()

    return {
      isLoggedIn: false,
      isLoggingIn: defer(
        loginMutation.state$.pipe(map(({ state }) => state === "pending")),
      ),
      handleSubmit(e: JsxRx.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)
        loginMutation.mutate({
          username: formData.get("username") as string,
          password: formData.get("password") as string,
        })
      },
    }
  },
  render({ children, isLoggingIn, isLoggedIn, handleSubmit }) {
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
            disabled={isLoggingIn}
          >
            Sign in
          </Button>
        </form>
      </main>
    )
  },
}) satisfies Component<PropsWithChildren>
