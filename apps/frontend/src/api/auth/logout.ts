import { noResponseBody } from "@jsxrx/api"
import { apiClient } from "../client.js"

export const authLogoutEndpoint = apiClient.createEndpoint({
  path: "/auth/logout",
  method: "POST",
  responseBodyParser: noResponseBody(),
  responseSetup(output) {
    return output.ok
  },
})
