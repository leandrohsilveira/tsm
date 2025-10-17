import { tw } from "@/utils/tw.js"
import { Props, WithChildren, WithClassName } from "@jsxrx/core"
import { Observable } from "rxjs"

type ListProps = WithChildren & WithClassName

export default function List($: Observable<ListProps>) {
  const { children, className } = Props.take($)

  return <ul className={tw("flex flex-col gap-1", className)}>{children}</ul>
}
