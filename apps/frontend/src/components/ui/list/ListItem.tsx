import { tw } from "@/utils/tw.js"
import { Props, WithChildren, WithClassName } from "@jsxrx/core"
import { Observable } from "rxjs"

type ListItemProps = WithChildren &
  WithClassName & {
    slim?: boolean
  }

export default function ListItem($: Observable<ListItemProps>) {
  const { className, children } = Props.take($)

  return <li className={tw("flex flex-1 [&>*]:p-4", className)}>{children}</li>
}
