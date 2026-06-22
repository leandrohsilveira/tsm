import { Props, Suspense } from "@jsxrx/core"
import { map, Observable, startWith } from "rxjs"
import Skeleton from "../ui/Skeleton.js"
import { ResolvedProps, RouteResolverInput } from "@jsxrx/router"
import { AuthLoginContext } from "@/contexts/auth/login.js"
import { UserData } from "@/interfaces/user/user.js"
import Button from "../ui/Button.js"

type HomeProps = Readonly<{
  user: UserData | null
  isRefresing: boolean
  onRefresh: () => void
}>

export function HomeResolver({
  context,
  refresh,
}: RouteResolverInput): ResolvedProps<HomeProps> {
  const authContext = context.require(AuthLoginContext)
  return {
    user: authContext.pipe(map(state => state.user)),
    isRefresing: authContext.pipe(map(state => state.isLoading)),
    async onRefresh() {
      refresh()
    },
  }
}

export default function Home(props$: Observable<HomeProps>) {
  const { user$, isRefresing$, onRefresh$ } = Props.take(props$)

  const name$ = user$.pipe(map(user => user?.firstName ?? "you (unnamed)"))

  const nameEl = (
    <Suspense fallback={<Skeleton className="inline-block h-4 w-24" />}>
      {name$}
    </Suspense>
  )

  return (
    <main className="p-4 flex flex-col gap-2">
      <h2>Home page</h2>
      <p>Hello {nameEl}! Welcome to TSM application!</p>
      {user$.pipe(
        startWith(null),
        map(user => {
          if (user) {
            return (
              <Button pending={isRefresing$} type="button" onClick={onRefresh$}>
                Refresh
              </Button>
            )
          }
          return null
        }),
      )}
    </main>
  )
}
