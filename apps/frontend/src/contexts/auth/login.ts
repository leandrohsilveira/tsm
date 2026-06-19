import { authUserInfoEndpoint } from "@/api/auth/info.js"
import { asyncValue, Context, IContextMap, pending, state } from "@jsxrx/core"
import { shallowComparator } from "@jsxrx/utils"
import { distinctUntilChanged, map, shareReplay } from "rxjs"

export interface AuthLoginState {
  isLoggedIn: boolean
  reload(): void
}

export const AuthLoginContext = new Context<AuthLoginState>(
  "AuthLoginContext",
  {
    isLoggedIn: false,
    reload() {},
  },
)

export function provideAuthContext(context: IContextMap) {
  const authUserInfoInput$ = state(Symbol())

  function reloadUserInfo() {
    authUserInfoInput$.set(Symbol())
  }

  const authState$ = authUserInfoInput$.pipe(
    map(inp => inp as unknown as null),
    authUserInfoEndpoint.fetch,
  )

  context.set(
    AuthLoginContext,
    authState$.pipe(
      asyncValue,
      map(info => ({
        isLoggedIn: info !== null,
        reload: reloadUserInfo,
      })),
      distinctUntilChanged(shallowComparator),
      shareReplay(),
    ),
  )

  return {
    state$: authState$.pipe(asyncValue),
    pending$: authState$.pipe(pending),
    reloadUserInfo,
  }
}
