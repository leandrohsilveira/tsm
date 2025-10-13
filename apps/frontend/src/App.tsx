import { Input, Suspense } from "@jsxrx/core"
import { filter, map, Observable } from "rxjs"
import Login from "./components/auth/Login.js"
import RootLayout from "./components/layout/root.js"
import Splashscreen from "./components/ui/Splashscreen.js"
import { provideAuthContext } from "./contexts/auth/login.js"

export default function App($: Observable<object>) {
  const input$ = Input.from($)

  const authContext = provideAuthContext(input$.context)

  const userInfo$ = authContext.state$.pipe(
    filter(data => data !== null),
    map(data => data.user),
  )

  return (
    <Suspense fallback={<Splashscreen />}>
      <RootLayout user={userInfo$}>
        <Login>Content</Login>
      </RootLayout>
    </Suspense>
  )
}
