import {
  combine,
  emitter,
  fromRef,
  Input,
  IState,
  PropsWithChildren,
  ref,
  Ref,
  state,
} from "@jsxrx/core"
import { fromRefEvent } from "@jsxrx/core/dom"
import {
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  startWith,
  withLatestFrom,
} from "rxjs"

type DropdownPosition =
  | "bottom-left"
  | "bottom-right"
  | "top-left"
  | "top-right"
type DropdownContainerProps = PropsWithChildren<{
  triggerRef: Ref<HTMLElement>
  trigger?: "click" | "hover"
  position?: DropdownPosition
  minHeight?: number
  minWidth?: number
  className?: string
  onClick?(e: Event, open$: IState<boolean>): void
}>

export default function DropdownContainer(
  $: Observable<DropdownContainerProps>,
) {
  const input$ = Input.from($)
  const {
    children,
    className,
    trigger,
    triggerRef,
    position,
    minHeight,
    minWidth,
    onClick,
  } = input$.take({
    trigger: "click",
    position: "bottom-left",
    minHeight: 200,
    minWidth: 250,
  })

  const dropdownRef = ref(HTMLDivElement)
  const open$ = state(false)
  const onClickEmitter = emitter(onClick)

  input$.observe(
    fromRefEvent(triggerRef, trigger).subscribe(() => {
      open$.set(!open$.value)
    }),
  )

  input$.observe(
    combineLatest({
      open: open$,
      ref: fromRef(triggerRef),
    })
      .pipe(filter(({ open, ref }) => open && !ref))
      .subscribe(() => open$.set(false)),
  )

  const boundaries$ = fromRefEvent(window, "resize", open$).pipe(
    map(() => getBoundaries()),
    debounceTime(300),
    startWith(getBoundaries()),
    distinctUntilChanged(
      (a, b) =>
        a.top + a.left + a.bottom + a.right ===
        b.top + b.left + b.bottom + b.right,
    ),
  )

  const scrollTop$ = fromRefEvent(window, "scroll", open$).pipe(
    map(() => window.scrollY),
    debounceTime(10),
    distinctUntilChanged(),
    startWith(window.scrollY),
  )

  input$.observe(
    fromRefEvent(window, "click", open$)
      .pipe(
        withLatestFrom(
          fromRef(dropdownRef),
          fromRef(triggerRef),
          (event, dropdownRef, triggerRef) => ({
            dropdownRef,
            triggerRef,
            event,
          }),
        ),
        filter(
          ({ dropdownRef, triggerRef }) =>
            dropdownRef !== null && triggerRef !== null,
        ),
      )
      .subscribe(({ event, dropdownRef, triggerRef }) => {
        if (event.target === null) return open$.set(false)
        if (!dropdownRef || !triggerRef) return open$.set(false)
        if (
          !dropdownRef.contains(event.target as Node) &&
          !triggerRef.contains(event.target as Node)
        )
          return open$.set(false)
        if (dropdownRef.contains(event.target as Node))
          return onClickEmitter.emit(event, open$)
        if (event.target !== dropdownRef && event.target !== triggerRef)
          return open$.set(false)
      }),
  )

  const dropdownStyle$ = combine({
    position,
    ref: fromRef(triggerRef),
    boundaries: boundaries$,
    minHeight,
    minWidth,
    scrollTop: scrollTop$,
  }).pipe(map(getDropdownContainerStyles))

  return open$.pipe(
    map(open => {
      if (!open) return null
      return (
        <div
          className={className}
          role="listbox"
          ref={dropdownRef}
          style={dropdownStyle$}
        >
          {children}
        </div>
      )
    }),
  )
}

function getDropdownContainerStyles({
  position,
  ref,
  boundaries,
  minHeight,
  minWidth,
}: {
  position: DropdownPosition
  ref: HTMLElement | null
  boundaries: { top: number; left: number; right: number; bottom: number }
  minHeight: number
  minWidth: number
}) {
  if (!ref) return null

  const isTopPosition = position === "top-left" || position === "top-right"
  const isBottomPosition =
    position === "bottom-left" || position === "bottom-right"
  const isLeftAligned = position === "bottom-left" || position === "top-left"
  const isRightAligned = position === "bottom-right" || position === "top-right"

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
    dropdownRight = Math.abs(right - boundaries.right)
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
}

function getBoundaries() {
  return {
    top: 0,
    left: 0,
    bottom: window.innerHeight,
    right: window.innerWidth,
  }
}
