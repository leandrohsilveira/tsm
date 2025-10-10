export interface User {
  id: string
  firstName?: string
  lastName?: string
  email: string
  password: string
}

export type UserData = Omit<User, "password">
