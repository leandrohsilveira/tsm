import { Input, ref, Suspense } from "@jsxrx/core"
import { filter, map, Observable } from "rxjs"
import Login from "./components/auth/Login.js"
import Button from "./components/ui/Button.js"
import { provideAuthContext } from "./contexts/auth/login.js"
import { UserData } from "./interfaces/user/user.js"
import Splashscreen from "./components/ui/Splashscreen.js"
import DropdownContainer from "./components/ui/Dropdown.js"

export default function App($: Observable<object>) {
  const input$ = Input.from($)

  const buttonRef$ = ref(HTMLButtonElement)
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
        <Button ref={buttonRef$} disabled={authContext.pending$}>
          User
        </Button>
        <DropdownContainer triggerRef={buttonRef$}>
          <div className="bg-neutral-200 text-neutral-200-fg p-4 rounded-md w-fit mt-0.5 shadow-lg shadow-neutral-300">
            Dropdown content
          </div>
        </DropdownContainer>
      </Login>
    </Suspense>
  )
}

function fullName(info: UserData) {
  if (info.firstName || info.lastName)
    return [info.firstName, info.lastName].filter(part => !!part).join("")
  return null
}
