import { provideAuthContext } from "@/contexts/auth/login.js"
import { Props, PropsWithChildren } from "@jsxrx/core"
import { ResolvedProps, RouteResolverInput } from "@jsxrx/router"
import { Observable } from "rxjs"

export type RootLayoutProps = PropsWithChildren

export function RootLayoutResolver({
  url$,
  context,
}: RouteResolverInput): ResolvedProps<RootLayoutProps> {
  provideAuthContext(context, url$)
  return {}
}

export default function RootLayout(props$: Observable<RootLayoutProps>) {
  const { children$ } = Props.take(props$)

  return children$
}
