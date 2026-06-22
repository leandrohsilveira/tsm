import { tw } from "@/utils/tw.js"
import { Props, PropsWithChildren, Suspense } from "@jsxrx/core"
import { map, Observable } from "rxjs"
import Skeleton from "./Skeleton.js"

type FormFieldProps = PropsWithChildren<{
  errors?: string[]
  label: string
  for: string
  pending?: boolean
}>

export default function FormField(input$: Observable<FormFieldProps>) {
  const { errors$, label$, for$, children$, pending$ } = Props.take(input$, {
    errors: [] as string[],
    pending: false,
  })

  const errorLength$ = errors$.pipe(map(errors => errors.length))
  const hasErrors$ = errorLength$.pipe(map(len => len > 0))

  return (
    <div
      className={tw(
        "w-full flex flex-col gap-1",
        "[&:has(:is(input,select,textarea):is(:focus,:focus-visible,:focus-within):not(:disabled))>label]:text-accent-500",
        {
          "text-error": hasErrors$,
        },
      )}
    >
      <label className="ml-0.5 font-bold" htmlFor={for$}>
        {label$}
      </label>
      <Suspense
        suspended={pending$}
        fallback={
          <Skeleton className="h-[height:var(--spacing-form-el-h)] px-form-el-px py-form-el-py rounded-[radius:var(--radius-form-el)]" />
        }
      >
        <div
          className={tw(
            "h-form-el-h px-form-el-px py-form-el-py flex flex-row items-center gap-1 [&>:is(input,select,textarea)]:flex-1",
            "border border-neutral-300 rounded-form-el",
            "bg-neutral-100",
            "disabled:border-neutral-200 disabled:bg-neutral-100 ring-0 ring-accent-400",
            "has-[:is(input,select,textarea):is(:focus,:focus-visible,:focus-within):not(:disabled)]:ring-2",
            "focus:not-disabled:border-accent-500 focus-visible:not-disabled:border-accent-500 focus-within:not-disabled:border-accent-500",
            {
              "border-error": hasErrors$,
            },
          )}
        >
          {children$}
        </div>
      </Suspense>
      {errors$.pipe(
        map(errors =>
          errors.map(error => (
            <span key={error} className="ml-0.5">
              {error}
            </span>
          )),
        ),
      )}
    </div>
  )
}
