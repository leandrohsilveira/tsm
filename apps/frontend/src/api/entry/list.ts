import { jsonResponseBody } from "@jsxrx/api"
import { apiClient } from "../client.js"
import type { Entry } from "@/interfaces/entry/entry.js"

type ListEntriesResponse = {
  entries: Entry[]
  total: number
}

export type ListEntriesParams = {
  from?: string
  to?: string
}

export const listEntriesEndpoint = apiClient.createEndpoint({
  method: "GET",
  path: "/entries",
  responseBodyParser: jsonResponseBody<ListEntriesResponse>(),
  requestSetup(params: ListEntriesParams) {
    return {
      search: params,
    }
  },
  responseSetup(output) {
    return output.body
  },
})
