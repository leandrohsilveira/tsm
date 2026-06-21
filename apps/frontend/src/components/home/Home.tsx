import { Props, Suspense } from "@jsxrx/core"
import { map, Observable } from "rxjs"
import Skeleton from "../ui/Skeleton.js"
import { ResolvedProps, RouteResolverInput } from "@jsxrx/router"
import { AuthLoginContext } from "@/contexts/auth/login.js"
import { UserData } from "@/interfaces/user/user.js"

type HomeProps = Readonly<{
  user: UserData | null
}>

export function HomeResolver({
  context,
}: RouteResolverInput): ResolvedProps<HomeProps> {
  const authContext = context.require(AuthLoginContext)
  return {
    user: authContext.pipe(map(state => state.user)),
  }
}

export default function Home(props$: Observable<HomeProps>) {
  const { user$ } = Props.take(props$)

  const name$ = user$.pipe(map(user => user?.firstName ?? "you (unnamed)"))

  const nameEl = (
    <Suspense
      fallback={<Skeleton className="bg-neutral-300 inline-block h-4 w-24" />}
    >
      {name$}
    </Suspense>
  )

  return (
    <main className="p-4 flex flex-col gap-2">
      <h2>Home page</h2>
      <p>Hello {nameEl}! Welcome to TSM application!</p>
    </main>
  )
}
