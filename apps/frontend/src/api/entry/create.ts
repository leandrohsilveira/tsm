import { jsonRequestBody, jsonResponseBody } from "@jsxrx/api"
import { Entry, EntryMode } from "@/interfaces/entry/entry.js"
import { apiClient } from "../client.js"

export const createEntryEndpoint = apiClient.createEndpoint({
  method: "POST",
  path: "/entries",
  requestBodyParser: jsonRequestBody<{ date: string; mode: EntryMode }>(),
  responseBodyParser: jsonResponseBody<Entry>(),
  requestSetup(body: { date: string; mode: EntryMode }) {
    return { body }
  },
  responseSetup(output) {
    return output.body
  },
})
