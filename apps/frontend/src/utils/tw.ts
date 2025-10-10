import { classes, ClassValue } from "@jsxrx/core"
import { map } from "rxjs"
import { twMerge } from "tailwind-merge"

export function tw(...inputs: ClassValue[]) {
  return classes(inputs).pipe(map(result => twMerge(result)))
}
