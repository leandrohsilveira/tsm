import { User } from "@/interfaces/user/user.js"
import { defineMockData } from "vite-plugin-mock-dev-server"

function createUser(data: Omit<User, "id">): User {
  return {
    id: crypto.randomUUID(),
    ...data,
  }
}

const ADMIN = createUser({
  email: "admin@email.com",
  firstName: "Admin",
  password: "123456",
})
const REGULAR = createUser({
  email: "user@email.com",
  password: "123456",
})
const TEST = createUser({
  email: "test@email.com",
  password: "123456",
})

const users = defineMockData("users", [ADMIN, REGULAR, TEST])

export default Object.freeze({
  users,
  ADMIN,
  REGULAR,
  TEST,
})
