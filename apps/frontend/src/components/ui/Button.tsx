import { cn } from "@/utils/cn.js"
import { Component, component, PropsWithChildren } from "@jsxrx/core"

type ButtonProps = PropsWithChildren<
  JsxRx.ButtonHTMLAttributes<HTMLButtonElement> & {
    color?: "accent" | "neutral" | "danger"
    type?: "button" | "submit"
  }
>

export default component({
  name: "Button",
  render({ className, children, color = "danger", type = "button", ...props }) {
    return (
      <button
        className={cn(
          "flex flex-row justify-center gap-2 h-form-el-h py-form-el-py px-form-el-px",
          "px-3 py-1 rounded-form-el cursor-pointer disabled:cursor-not-allowed",
          "focus:not-disabled:ring-2 focus-visible:not-disabled:ring-2 focus-within:not-disabled:outline-2",
          "transition-all duration-300 ease-in-out",
          {
            neutral: cn(
              "bg-neutral-600 text-neutral-600-fg",
              "hover:not-disabled:bg-neutral-500 hover:not-disabled:text-neutral-500-fg",
              "focus:not-disabled:ring-neutral-700 focus-visible:not-disabled:outline-neutral-700 focus-within:not-disabled:outline-neutral-700",
              "disabled:bg-neutral-600/20 disabled:text-neutral-50-fg/20",
            ),
            accent: cn(
              "bg-accent-600 text-accent-600-fg",
              "hover:not-disabled:bg-accent-500 hover:not-disabled:text-accent-500-fg",
              "focus:not-disabled:ring-accent-400 focus-visible:not-disabled:outline-accent-400 focus-within:not-disabled:outline-accent-400",
              "disabled:bg-accent-600/20 disabled:text-accent-50-fg/20",
            ),
            danger: cn(
              "bg-error text-error-fg",
              "hover:not-disabled:bg-error hover:not-disabled:text-error-fg",
              "focus:not-disabled:ring-error focus-visible:not-disabled:outline-error focus-within:not-disabled:outline-error",
              "disabled:bg-error/20 disabled:text-error-fg/20",
            ),
          }[color],
          className,
        )}
        type={type}
        {...props}
      >
        {children}
      </button>
    )
  },
}) satisfies Component<ButtonProps>
