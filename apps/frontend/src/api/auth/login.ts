import { LoginPayload } from "@/interfaces/auth/login.js"
import { jsonRequestBody, noResponseBody } from "@jsxrx/api"
import { apiClient } from "../client.js"

export const loginEndpoint = apiClient.createEndpoint({
  method: "POST",
  path: "/auth/login",
  requestBodyParser: jsonRequestBody<LoginPayload>(),
  responseBodyParser: noResponseBody(),
  requestSetup(body: LoginPayload) {
    return {
      body,
    }
  },
  responseSetup({ ok }) {
    return ok
  },
})
