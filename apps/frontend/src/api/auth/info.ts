import { jsonResponseBody } from "@jsxrx/api"
import { apiClient } from "../client.js"
import { AuthUserInfo } from "@/interfaces/auth/info.js"

export const authUserInfoEndpoint = apiClient.createEndpoint({
  method: "GET",
  path: "/auth/info",
  responseBodyParser: jsonResponseBody<AuthUserInfo | null>(),
  responseSetup(output) {
    return output.body
  },
})
