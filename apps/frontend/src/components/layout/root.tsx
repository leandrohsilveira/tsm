import { UserData as DisplayName } from "@/interfaces/user/user.js"
import { Input, PropsWithChildren, ref } from "@jsxrx/core"
import { map, Observable } from "rxjs"
import DropdownContainer from "../ui/Dropdown.js"

type RootLayoutProps = PropsWithChildren<{
  user: DisplayName | null
  onLogin?(): void
}>

export default function RootLayout($: Observable<RootLayoutProps>) {
  const input$ = Input.from($)

  const { children, user: userInfo$, onLogin } = input$.take()

  const displayName$ = userInfo$.pipe(map(displayName))

  const userDropdownTrigger$ = ref(HTMLElement)

  return (
    <>
      <header className="bg-primary-400 text-primary-400-fg px-6 py-4 flex items-center justify-between">
        <h1>TSM</h1>
        {displayName$.pipe(
          map(name => {
            if (!name)
              return (
                <button type="button" onClick={onLogin}>
                  Login
                </button>
              )
            return (
              <button
                ref={userDropdownTrigger$}
                type="button"
                className="cursor-pointer"
              >
                {name}
              </button>
            )
          }),
        )}
      </header>
      {children}
      <DropdownContainer
        className="w-fit"
        triggerRef={userDropdownTrigger$}
        position="bottom-right"
      >
        <div className="bg-neutral-200 text-neutral-200-fg p-4 rounded-md mt-1 shadow-lg shadow-neutral-300">
          User: {displayName$}
        </div>
      </DropdownContainer>
    </>
  )
}

function displayName(info: DisplayName | null) {
  if (info?.firstName || info?.lastName)
    return [info.firstName, info.lastName].filter(part => !!part).join("")
  return info?.email ?? null
}
