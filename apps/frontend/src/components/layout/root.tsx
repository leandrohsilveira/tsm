import { UserData } from "@/interfaces/user/user.js"
import {
  asyncValue,
  Input,
  PropsWithChildren,
  ref,
  Suspense,
} from "@jsxrx/core"
import { map, Observable, of } from "rxjs"
import DropdownContainer from "../ui/Dropdown.js"
import List from "../ui/list/List.js"
import ListItem from "../ui/list/ListItem.js"
import Skeleton from "../ui/Skeleton.js"
import { authUserInfoEndpoint } from "@/api/auth/info.js"

type RootLayoutProps = PropsWithChildren<{
  user: UserData | null
  onLogin?(): void
  onLogout?(): void
}>

export function RootLayoutResolver() {
  return {
    user: authUserInfoEndpoint.fetch(of(null)).pipe(
      asyncValue,
      map(data => data?.user ?? null),
    ),
  }
}

export default function RootLayout($: Observable<RootLayoutProps>) {
  const input$ = Input.from($)

  const { children, user: userInfo$, onLogin, onLogout } = input$.take()

  const displayName$ = userInfo$.pipe(map(displayName))

  const dropdownTriggerRef$ = ref(HTMLElement)

  return (
    <>
      <header className="bg-primary-800 text-primary-800-fg px-6 py-4 flex items-center justify-between">
        <h1>TSM</h1>
        <Suspense
          fallback={
            <Skeleton className="bg-primary-900 h-10 w-full max-w-60" />
          }
        >
          {displayName$.pipe(
            map(name => {
              if (!name)
                return (
                  <button
                    className="p-2 cursor-pointer rounded-md hover:bg-primary-900 hover:text-primary-900-fg"
                    type="button"
                    onClick={onLogin}
                  >
                    Login
                  </button>
                )
              return (
                <button
                  ref={dropdownTriggerRef$}
                  type="button"
                  className="p-2 cursor-pointer rounded-md hover:bg-primary-900 hover:text-primary-900-fg"
                >
                  {name}
                </button>
              )
            }),
          )}
        </Suspense>
      </header>
      {children}
      <DropdownContainer
        className="w-fit"
        triggerRef={dropdownTriggerRef$}
        position="bottom-right"
        onClick={(e, open$) => {
          if (e.target instanceof HTMLButtonElement) open$.set(false)
        }}
      >
        <List className="bg-neutral-200 text-neutral-200-fg rounded-md mt-1 shadow-lg shadow-neutral-300 [&>li:last-child>*]:rounded-b-md [&>li:first-child>*]:rounded-t-md">
          <ListItem>
            <Suspense fallback={<Skeleton />}>
              <span>User: {displayName$}</span>
            </Suspense>
          </ListItem>
          <ListItem>
            <button
              className="w-full cursor-pointer hover:bg-neutral-300 hover:text-neutral-300-fg"
              type="button"
              onClick={onLogout}
            >
              Logout
            </button>
          </ListItem>
        </List>
      </DropdownContainer>
    </>
  )
}

function displayName(info: UserData | null) {
  if (info?.firstName || info?.lastName)
    return [info.firstName, info.lastName].filter(part => !!part).join("")
  return info?.email ?? null
}
