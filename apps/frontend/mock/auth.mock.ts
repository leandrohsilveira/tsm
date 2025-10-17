import { AuthUserInfo } from "@/interfaces/auth/info.js"
import { User } from "@/interfaces/user/user.js"
import { defineMock, MockRequest } from "vite-plugin-mock-dev-server"

const users = [
  createUser({ email: "admin@email.com", password: "123456" }),
  createUser({ email: "user@email.com", password: "123456" }),
  createUser({ email: "test@email.com", password: "123456" }),
]

function createUser(data: Omit<User, "id">): User {
  return {
    id: crypto.randomUUID(),
    ...data,
  }
}

export function getUserFromToken(req: MockRequest) {
  const authotization = req.getCookie("Authorization")
  if (!authotization || !authotization.toLowerCase().startsWith("userid "))
    return null
  const id = authotization.replace(/^UserId /i, "")
  return users.find(user => user.id === id)
}

export default defineMock([
  {
    url: "/api/auth/login",
    method: "POST",
    delay: [100, 2000],
    response(req, res) {
      const { username, password } = req.body
      const user = users.find(
        u => u.email === username && u.password === password,
      )
      if (!user) {
        res.statusCode = 403
        res.end(JSON.stringify({ message: "Incorrect username or password" }))
        return
      }
      res.statusCode = 200
      res.setCookie("Authorization", `UserId ${user.id}`, {
        httpOnly: true,
        path: "/",
      })
      res.end()
    },
  },
  {
    url: "/api/auth/info",
    method: "GET",
    delay: [250, 1500],
    response(req, res) {
      const user = getUserFromToken(req)
      res.statusCode = 200
      if (!user) {
        res.end(JSON.stringify(null))
        return
      }
      res.end(
        JSON.stringify({
          user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
          },
        } satisfies AuthUserInfo),
      )
      return
    },
  },
  {
    url: "/api/auth/logout",
    method: "POST",
    delay: [250, 600],
    response(_, res) {
      res.setCookie("Authorization")
      res.statusCode = 200
      res.end(null)
    },
  },
])
