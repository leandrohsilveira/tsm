import { lazy } from "@jsxrx/core"
import { defineRoutes, lazyResolver, route } from "@jsxrx/router"

const RootLayout = lazy(() => import("./components/layout/RootLayout.js"))
const RootLayoutResolver = lazyResolver(
  () => import("./components/layout/RootLayout.js"),
  "RootLayoutResolver",
)

const FullLayout = lazy(() => import("./components/layout/FullLayout.js"))
const FullLayoutResolver = lazyResolver(
  () => import("./components/layout/FullLayout.js"),
  "FullLayoutResolver",
)

const Login = lazy(() => import("./components/auth/Login.js"))
const LoginResolver = lazyResolver(
  () => import("./components/auth/Login.js"),
  "LoginResolver",
)

const Home = lazy(() => import("./components/home/Home.js"))
const HomeResolver = lazyResolver(
  () => import("./components/home/Home.js"),
  "HomeResolver",
)

const EntryList = lazy(() => import("./components/entry/EntryList.js"))
const EntryListResolver = lazyResolver(
  () => import("./components/entry/EntryList.js"),
  "EntryListResolver",
)

export const routes = defineRoutes({
  index: route("root", RootLayout, {
    resolve: RootLayoutResolver,
    children: {
      "/login": route("login", Login, {
        resolve: LoginResolver,
      }),
      index: route("root-layout", FullLayout, {
        resolve: FullLayoutResolver,
        children: {
          "/entries": route("entries", EntryList, {
            resolve: EntryListResolver,
          }),
          index: route("home", Home, {
            resolve: HomeResolver,
          }),
        },
      }),
    },
  }),
})
