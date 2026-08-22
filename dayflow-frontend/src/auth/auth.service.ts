import type { User } from './auth.types'

const USERS_KEY = 'dayflow_users'
const CURRENT_USER_KEY = 'dayflow_current_user'

function getUsers(): User[] {
  const users = localStorage.getItem(USERS_KEY)

  if (!users) {
    return []
  }

  return JSON.parse(users) as User[]
}

function saveUsers(users: User[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function signup(
  fullName: string,
  email: string,
  password: string,
): User {
  const users = getUsers()

  const normalizedEmail = email.trim().toLowerCase()

  const existingUser = users.find(
    (user) => user.email === normalizedEmail,
  )

  if (existingUser) {
    throw new Error('An account with this email already exists.')
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    fullName: fullName.trim(),
    email: normalizedEmail,
    password,
    role: 'employee',
  }

  users.push(newUser)

  saveUsers(users)

  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(newUser),
  )

  return newUser
}

export function login(
  email: string,
  password: string,
): User {
  const users = getUsers()

  const normalizedEmail = email.trim().toLowerCase()

  const user = users.find(
    (user) =>
      user.email === normalizedEmail &&
      user.password === password,
  )

  if (!user) {
    throw new Error('Invalid email or password.')
  }

  localStorage.setItem(
    CURRENT_USER_KEY,
    JSON.stringify(user),
  )

  return user
}

export function logout() {
  localStorage.removeItem(CURRENT_USER_KEY)
}

export function getCurrentUser(): User | null {
  const user = localStorage.getItem(CURRENT_USER_KEY)

  if (!user) {
    return null
  }

  return JSON.parse(user) as User
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}