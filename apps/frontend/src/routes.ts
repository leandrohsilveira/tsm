import { defineRoutes, route } from "@jsxrx/router"
import RootLayout, { RootLayoutResolver } from "./components/layout/root.js"
import Login, { LoginResolver } from "./components/auth/Login.js"
import Home from "./components/home/Home.js"

export const routes = defineRoutes({
  "/login": route("login", Login, {
    resolve: LoginResolver,
  }),
  index: route("root-layout", RootLayout, {
    resolve: RootLayoutResolver,
    children: {
      index: route("home", Home),
    },
  }),
})
