import { Entry } from "@/interfaces/entry/entry.js"
import { defineMockData } from "vite-plugin-mock-dev-server"
import authData from "./auth.data.js"

function createEntry(data: Omit<Entry, "id">): Entry {
  return {
    id: crypto.randomUUID(),
    ...data,
  }
}

const today = new Date()

const ENTRY_1 = createEntry({
  userId: authData.ADMIN.id,
  date: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 0,
    8,
    30,
  ),
  mode: "now",
})
const ENTRY_2 = createEntry({
  userId: authData.ADMIN.id,
  date: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
    9,
    0,
  ),
  mode: "manual",
})
const ENTRY_3 = createEntry({
  userId: authData.REGULAR.id,
  date: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 1,
    14,
    15,
  ),
  mode: "now",
})
const ENTRY_4 = createEntry({
  userId: authData.REGULAR.id,
  date: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 2,
    7,
    45,
  ),
  mode: "manual",
})
const ENTRY_5 = createEntry({
  userId: authData.TEST.id,
  date: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 3,
    10,
    0,
  ),
  mode: "now",
})
const ENTRY_6 = createEntry({
  userId: authData.ADMIN.id,
  date: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 4,
    16,
    30,
  ),
  mode: "manual",
})
const ENTRY_7 = createEntry({
  userId: authData.REGULAR.id,
  date: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 5,
    11,
    0,
  ),
  mode: "now",
})
const ENTRY_8 = createEntry({
  userId: authData.TEST.id,
  date: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 5,
    13,
    20,
  ),
  mode: "manual",
})
const ENTRY_9 = createEntry({
  userId: authData.ADMIN.id,
  date: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 6,
    6,
    0,
  ),
  mode: "now",
})
const ENTRY_10 = createEntry({
  userId: authData.REGULAR.id,
  date: new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 7,
    18,
    45,
  ),
  mode: "manual",
})

const entries = defineMockData("entries", [
  ENTRY_1,
  ENTRY_2,
  ENTRY_3,
  ENTRY_4,
  ENTRY_5,
  ENTRY_6,
  ENTRY_7,
  ENTRY_8,
  ENTRY_9,
  ENTRY_10,
])

export default Object.freeze({
  entries,
  ENTRY_1,
  ENTRY_2,
  ENTRY_3,
  ENTRY_4,
  ENTRY_5,
  ENTRY_6,
  ENTRY_7,
  ENTRY_8,
  ENTRY_9,
  ENTRY_10,
})
