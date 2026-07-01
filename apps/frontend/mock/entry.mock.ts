import { Entry } from "@/interfaces/entry/entry.js"
import { defineMock, MockRequest } from "vite-plugin-mock-dev-server"
import { getUserFromToken } from "./auth.mock.js"
import entriesData from "./entry.data.js"

export default defineMock([
  {
    url: "/api/entries",
    method: "GET",
    delay: [200, 800],
    response(req: MockRequest, res) {
      const user = getUserFromToken(req)
      if (!user) {
        res.statusCode = 403
        res.end(JSON.stringify({ message: "Unauthenticated" }))
        return
      }

      const entries = entriesData.entries.value

      res.statusCode = 200
      res.end(JSON.stringify({ entries, total: entries.length }))
    },
  },
  {
    url: "/api/entries",
    method: "POST",
    delay: [100, 500],
    response(req: MockRequest, res) {
      const user = getUserFromToken(req)
      if (!user) {
        res.statusCode = 403
        res.end(JSON.stringify({ message: "Unauthenticated" }))
        return
      }

      const { date, mode } = req.body as { date?: string; mode?: string }

      if (!date || !mode) {
        res.statusCode = 400
        res.end(JSON.stringify({ message: "Missing required fields" }))
        return
      }

      if (mode !== "now" && mode !== "manual") {
        res.statusCode = 400
        res.end(JSON.stringify({ message: "Invalid mode" }))
        return
      }

      const newEntry: Entry = {
        id: crypto.randomUUID(),
        userId: user.id,
        date: new Date(date),
        mode,
      }

      entriesData.entries.value.push(newEntry)

      res.statusCode = 201
      res.end(JSON.stringify(newEntry))
    },
  },
])
