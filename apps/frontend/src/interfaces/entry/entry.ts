import type { EntryModeEnum } from "@/enums/entry/entry-mode.js"
import { EnumValues } from "../utils/enum.js"

export type EntryMode = EnumValues<typeof EntryModeEnum>

export interface Entry {
  id: string
  userId: string
  date: Date
  mode: EntryMode
}
