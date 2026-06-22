import { authUserInfoEndpoint } from "@/api/auth/info.js"
import { UserData } from "@/interfaces/user/user.js"
import { Context, IContextMap, pending, state } from "@jsxrx/core"
import { map, shareReplay } from "rxjs"

export interface AuthLoginState {
  user: UserData | null
  isLoggedIn: boolean
  reload(): void
}

export const AuthLoginContext = new Context<AuthLoginState>(
  "AuthLoginContext",
  {
    user: null,
    isLoggedIn: false,
    reload() {},
  },
)

export function provideAuthContext(context: IContextMap) {
  const authUserInfoInput$ = state(Symbol())

  function reloadUserInfo() {
    authUserInfoInput$.set(Symbol())
  }

  const authState$ = authUserInfoEndpoint.fetch(
    authUserInfoInput$.pipe(map(inp => inp as unknown as null)),
  )

  context.set(
    AuthLoginContext,
    authState$.pipe(
      map(info => ({
        user: info?.user ?? null,
        isLoggedIn: info !== null,
        reload: reloadUserInfo,
      })),
      shareReplay(),
    ),
  )

  return {
    state$: authState$,
    pending$: pending(authState$),
    reloadUserInfo,
  }
}
