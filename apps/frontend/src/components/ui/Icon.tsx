import { tw } from "@/utils/tw.js"
import { Props, rawHtml } from "@jsxrx/core"
import { map, Observable } from "rxjs"

export type IconProps = Readonly<{
  id: string
  content: string
  className?: string
}>

export default function Icon(props$: Observable<IconProps>) {
  const { id$, content$, className$ } = Props.take(props$)

  return (
    <div
      className={tw("w-full h-full [&>svg]:w-full [&>svg]:h-full", className$)}
    >
      {id$.pipe(map(id => rawHtml(id, content$)))}
    </div>
  )
}
