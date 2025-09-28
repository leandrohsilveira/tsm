import { cn } from "@/utils/cn.js"
import { component, Component, PropsWithChildren } from "@jsxrx/core"

export default component({
  name: "FormField",
  render({ errors = [], label, for: htmlFor, children }) {
    return (
      <div
        className={cn(
          "w-full flex flex-col gap-1",
          "[&:has(:is(input,select,textarea):is(:focus,:focus-visible,:focus-within):not(:disabled))>label]:text-accent-500",
          {
            "text-error": errors.length > 0,
          },
        )}
      >
        <label className="ml-0.5 font-bold" htmlFor={htmlFor}>
          {label}
        </label>
        <div
          className={cn(
            "h-form-el-h px-form-el-px py-form-el-py flex flex-row items-center gap-1 [&>:is(input,select,textarea)]:flex-1",
            "border border-neutral-300 rounded-form-el",
            "bg-neutral-100",
            "disabled:border-neutral-200 disabled:bg-neutral-100 ring-0 ring-accent-400",
            "has-[:is(input,select,textarea):is(:focus,:focus-visible,:focus-within):not(:disabled)]:ring-2",
            "focus:not-disabled:border-accent-500 focus-visible:not-disabled:border-accent-500 focus-within:not-disabled:border-accent-500",
            {
              "border-error": errors.length > 0,
            },
          )}
        >
          {children}
        </div>
        {errors.map(error => (
          <span key={error} className="ml-0.5">
            {error}
          </span>
        ))}
      </div>
    )
  },
}) satisfies Component<
  PropsWithChildren<{ errors?: string[]; label: string; for: string }>
>
