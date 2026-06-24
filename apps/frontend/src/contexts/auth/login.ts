import { authUserInfoEndpoint } from "@/api/auth/info.js"
import { UserData } from "@/interfaces/user/user.js"
import { combine, Context, IContextMap, pending, state } from "@jsxrx/core"
import { combineLatest, debounceTime, map, Observable, shareReplay } from "rxjs"

export interface AuthLoginState {
  user: UserData | null
  isLoading: boolean
  isLoggedIn: boolean
  reload(): void
}

export const AuthLoginContext = new Context<AuthLoginState>(
  "AuthLoginContext",
  {
    user: null,
    isLoading: true,
    isLoggedIn: false,
    reload() {},
  },
)

export function provideAuthContext(
  context: IContextMap,
  url$: Observable<URL>,
) {
  const authUserInfoInput$ = state(Symbol())

  function reloadUserInfo() {
    authUserInfoInput$.set(Symbol())
  }

  const state$ = authUserInfoEndpoint.fetch(
    combineLatest([authUserInfoInput$, url$]).pipe(
      debounceTime(1),
      map(inp => inp as unknown as null),
    ),
  )

  const pending$ = pending(state$)

  context.set(
    AuthLoginContext,
    combine({ info: state$, isLoading: pending$ }).pipe(
      debounceTime(1),
      map(({ info, isLoading }) => ({
        user: info?.user ?? null,
        isLoading,
        isLoggedIn: info !== null,
        reload: reloadUserInfo,
      })),
      shareReplay(),
    ),
  )

  return {
    state$,
    pending$,
    reloadUserInfo,
  }
}
