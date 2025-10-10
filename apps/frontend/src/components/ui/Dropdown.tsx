import {
  combine,
  fromRef,
  Input,
  PropsWithChildren,
  Ref,
  state,
} from "@jsxrx/core"
import {
  debounceTime,
  distinctUntilChanged,
  filter,
  fromEvent,
  map,
  Observable,
  startWith,
  switchMap,
  takeUntil,
} from "rxjs"

type DropdownContainerProps = PropsWithChildren<{
  triggerRef: Ref<HTMLElement>
  trigger?: "click" | "hover"
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right"
  minHeight?: number
  minWidth?: number
}>

export default function DropdownContainer(
  $: Observable<DropdownContainerProps>,
) {
  const input$ = Input.from($)
  const { children, trigger, triggerRef, position, minHeight, minWidth } =
    input$.take({
      trigger: "click",
      position: "bottom-left",
      minHeight: 200,
      minWidth: 250,
    })

  const open$ = state(false)

  input$.observe(
    combine({
      trigger,
      ref: fromRef(triggerRef),
    })
      .pipe(
        filter(input => input.ref !== null),
        switchMap(input => fromEvent(input.ref!, input.trigger)),
      )
      .subscribe(() => {
        open$.set(!open$.value)
      }),
  )

  const boundaries$ = open$.pipe(
    filter(open => open),
    takeUntil(open$.pipe(filter(open => !open))),
    switchMap(() => fromEvent(window, "resize")),
    map(() => getBoundaries()),
    debounceTime(300),
    startWith(getBoundaries()),
    distinctUntilChanged(
      (a, b) =>
        a.top + a.left + a.bottom + a.right ===
        b.top + b.left + b.bottom + b.right,
    ),
  )

  const scrollTop$ = open$.pipe(
    distinctUntilChanged(),
    takeUntil(open$.pipe(filter(open => !open))),
    switchMap(() => fromEvent(window, "scroll")),
    map(() => window.scrollY),
    debounceTime(10),
    startWith(window.scrollY),
  )

  const dropdownStyle$ = combine({
    position,
    ref: fromRef(triggerRef),
    boundaries: boundaries$,
    minHeight,
    minWidth,
    scrollTop: scrollTop$,
  }).pipe(
    map(({ position, ref, boundaries, minHeight, minWidth }) => {
      if (!ref) return null

      const isTopPosition = position === "top-left" || position === "top-right"
      const isBottomPosition =
        position === "bottom-left" || position === "bottom-right"
      const isLeftAligned =
        position === "bottom-left" || position === "top-left"
      const isRightAligned =
        position === "bottom-right" || position === "top-right"

      const { top, bottom, left, right } = ref.getBoundingClientRect()

      // bottom-left defaults
      const bottomRoom = Math.abs(bottom - boundaries.bottom)
      const topRoom = Math.abs(top - boundaries.top)
      const leftRoom = Math.abs(right - boundaries.left)
      const rightRoom = Math.abs(left - boundaries.right)
      let dropdownLeft: number | undefined = left
      let dropdownRight: number | undefined = undefined
      let dropdownTop: number | undefined = bottom
      let dropdownBottom: number | undefined = undefined
      let maxWidth = rightRoom
      let maxHeight = bottomRoom

      if (
        isTopPosition ||
        (isBottomPosition && bottomRoom < minHeight && topRoom > bottomRoom)
      ) {
        dropdownTop = undefined
        dropdownBottom = top
        maxHeight = topRoom
      }

      if (
        isRightAligned ||
        (isLeftAligned && maxWidth < minWidth && leftRoom > rightRoom)
      ) {
        dropdownLeft = undefined
        dropdownRight = right
        maxWidth = leftRoom
      }

      return {
        position: "fixed",
        top: dropdownTop,
        bottom: dropdownBottom,
        left: dropdownLeft,
        right: dropdownRight,
        maxWidth,
        maxHeight,
      }
    }),
  )

  return open$.pipe(
    map(open => {
      if (!open) return null
      return <div style={dropdownStyle$}>{children}</div>
    }),
  )
}

function getBoundaries() {
  return {
    top: 0,
    left: 0,
    bottom: window.innerHeight,
    right: window.innerWidth,
  }
}
