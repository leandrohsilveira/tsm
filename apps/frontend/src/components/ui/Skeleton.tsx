import { tw } from "@/utils/tw.js"
import { Props, WithClassName } from "@jsxrx/core"
import { Observable } from "rxjs"

type SkeletonProps = WithClassName

export default function Skeleton($: Observable<SkeletonProps>) {
  const { className } = Props.take($)

  return (
    <div
      className={tw(
        "bg-neutral-100 animate-pulse rounded-xl h-full w-full",
        className,
      )}
    />
  )
}
