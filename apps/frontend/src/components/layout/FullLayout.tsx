import { authLogoutEndpoint } from "@/api/auth/logout.js"
import { AuthLoginContext } from "@/contexts/auth/login.js"
import { UserData } from "@/interfaces/user/user.js"
import { Props, PropsWithChildren, ref, Suspense } from "@jsxrx/core"
import { ResolvedProps, RouteResolverInput } from "@jsxrx/router"
import { lastValueFrom, map, Observable, take } from "rxjs"
import DropdownContainer from "../ui/Dropdown.js"
import List from "../ui/list/List.js"
import ListItem from "../ui/list/ListItem.js"
import Skeleton from "../ui/Skeleton.js"
import Icon from "../ui/Icon.js"

type FullLayoutProps = PropsWithChildren<{
  user: UserData | null
  onLogin?(): void
  onLogout?(): void
}>

export function FullLayoutResolver({
  url$,
  context,
  navigate,
  refresh,
}: RouteResolverInput): ResolvedProps<FullLayoutProps> {
  const authContext$ = context.require(AuthLoginContext)
  const logoutAction = authLogoutEndpoint.action()
  return {
    user: authContext$.pipe(map(data => data?.user ?? null)),
    async onLogin() {
      const url = await lastValueFrom(url$.pipe(take(1)))
      navigate("/login", {
        query: {
          next: url.pathname,
        },
      })
    },
    async onLogout() {
      await logoutAction.perform(null)
      navigate("/")
      refresh()
    },
  }
}

export default function FullLayout(input$: Observable<FullLayoutProps>) {
  const { children$, user$, onLogin$, onLogout$ } = Props.take(input$)

  const displayName$ = user$.pipe(map(displayName))

  const dropdownTriggerRef$ = ref(HTMLElement)

  return (
    <>
      <header className="bg-primary-800 text-primary-800-fg px-6 py-4 flex items-center justify-between">
        <h1>TSM</h1>
        <Suspense fallback={<Skeleton className="h-10 w-full max-w-60" />}>
          {displayName$.pipe(
            map(name => {
              if (!name)
                return (
                  <button
                    className="p-2 cursor-pointer rounded-md hover:bg-primary-900 hover:text-primary-900-fg"
                    type="button"
                    onClick={onLogin$}
                  >
                    Login
                  </button>
                )
              return (
                <button
                  ref={dropdownTriggerRef$}
                  type="button"
                  className="p-2 flex flex-row gap-2 items-center cursor-pointer rounded-md hover:bg-primary-900 hover:text-primary-900-fg"
                >
                  <Icon
                    id="user-menu-icon"
                    className="h-6 w-6"
                    content={import("@tsm/icons/person-circle.svg?raw")}
                  />
                  {name}
                </button>
              )
            }),
          )}
        </Suspense>
      </header>
      {children$}
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
              onClick={onLogout$}
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
