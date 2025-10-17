import { Input, Suspense } from "@jsxrx/core"
import { map, Observable } from "rxjs"
import RootLayout from "./components/layout/root.js"
import Splashscreen from "./components/ui/Splashscreen.js"
import { provideAuthContext } from "./contexts/auth/login.js"
import { authLogoutEndpoint } from "./api/auth/logout.js"

export default function App($: Observable<object>) {
  const input$ = Input.from($)

  const authContext = provideAuthContext(input$.context)

  const userInfo$ = authContext.state$.pipe(map(data => data?.user ?? null))

  const logoutAction = authLogoutEndpoint.action()

  async function logout() {
    const loggedOut = await logoutAction.perform(null)
    if (loggedOut) {
      authContext.reloadUserInfo()
    }
  }

  return (
    <Suspense fallback={<Splashscreen />}>
      <RootLayout user={userInfo$} onLogout={logout}>
        TODO: add router here
      </RootLayout>
    </Suspense>
  )
}
