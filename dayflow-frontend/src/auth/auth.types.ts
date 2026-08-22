export type UserRole = 'employee'

export interface User {
  id: string
  fullName: string
  email: string
  password: string
  role: UserRole
}