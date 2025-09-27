import { defineMock } from "vite-plugin-mock-dev-server"

interface User {
  id: string
  firstName?: string
  lastName?: string
  email: string
  password: string
}

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

export default defineMock([
  {
    url: "/login",
    method: "POST",
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
])
