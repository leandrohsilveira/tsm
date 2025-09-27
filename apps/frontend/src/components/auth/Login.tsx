import { Component, component, PropsWithChildren } from "@jsxrx/core"
import FormField from "../ui/FormField.js"
import Button from "../ui/Button.js"

export default component({
  name: "Login",
  pipe() {
    return {
      isLoggedIn: false,
      handleSubmit(e: JsxRx.FormEvent<HTMLFormElement>) {
        e.preventDefault()
      },
    }
  },
  render({ children, isLoggedIn, handleSubmit }) {
    if (isLoggedIn) return children
    return (
      <main className="h-svh w-full flex items-center justify-center">
        <form
          className="flex flex-col w-full items-center max-w-96 p-2 gap-4"
          onSubmit={handleSubmit}
        >
          <h1>Login</h1>
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
          <Button type="submit" color="accent" className="w-full">
            Sign in
          </Button>
        </form>
      </main>
    )
  },
}) satisfies Component<PropsWithChildren>
