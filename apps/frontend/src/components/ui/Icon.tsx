import { tw } from "@/utils/tw.js"
import { Props, rawHtml, Suspense } from "@jsxrx/core"
import { from, map, Observable, of, switchMap } from "rxjs"
import Skeleton from "./Skeleton.js"

export type IconProps = Readonly<{
  id: string
  content: string | Promise<string | { default: string }> | { default: string }
  className?: string
}>

export default function Icon(props$: Observable<IconProps>) {
  const { id$, content$, className$ } = Props.take(props$)

  return (
    <div
      className={tw("w-full h-full [&>svg]:w-full [&>svg]:h-full", className$)}
    >
      <Suspense fallback={<Skeleton />}>
        {id$.pipe(
          map(id =>
            rawHtml(
              id,
              content$.pipe(
                switchMap(content =>
                  content instanceof Promise ? from(content) : of(content),
                ),
                map(content =>
                  typeof content === "string" ? content : content.default,
                ),
              ),
            ),
          ),
        )}
      </Suspense>
    </div>
  )
}
