import { Input, Suspense } from "@jsxrx/core"
import { filter, map, Observable } from "rxjs"
import Login from "./components/auth/Login.js"
import Button from "./components/ui/Button.js"
import { provideAuthContext } from "./contexts/auth/login.js"
import { UserData } from "./interfaces/user/user.js"
import Splashscreen from "./components/ui/Splashscreen.js"

export default function App($: Observable<object>) {
  const input$ = Input.from($)

  const authContext = provideAuthContext(input$.context)

  const userInfo$ = authContext.state$.pipe(
    filter(data => data !== null),
    map(data => data.user),
  )

  const email$ = userInfo$.pipe(map(user => user.email))
  const fullName$ = userInfo$.pipe(map(fullName))

  return (
    <Suspense fallback={<Splashscreen />}>
      <Login>
        <Suspense fallback="Loading authentication...">
          <h4>Authenticated user</h4>
          <div>Email: {email$}</div>
          {fullName$.pipe(
            map(name => (name ? <div>Full name: {name}</div> : null)),
          )}
        </Suspense>
        <Button
          disabled={authContext.pending$}
          onClick={authContext.reloadUserInfo}
        >
          Reload user data
        </Button>
      </Login>
    </Suspense>
  )
}

function fullName(info: UserData) {
  if (info.firstName || info.lastName)
    return [info.firstName, info.lastName].filter(part => !!part).join("")
  return null
}
