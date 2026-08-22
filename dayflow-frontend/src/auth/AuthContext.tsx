import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { User } from './auth.types'
import {
  getCurrentUser,
  login as loginUser,
  logout as logoutUser,
  signup as signupUser,
} from './auth.service'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => User
  signup: (fullName: string, email: string, password: string) => User
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const currentUser = getCurrentUser()

    setUser(currentUser)
    setLoading(false)
  }, [])

  const login = (email: string, password: string) => {
    const loggedInUser = loginUser(email, password)

    setUser(loggedInUser)

    return loggedInUser
  }

  const signup = (
    fullName: string,
    email: string,
    password: string,
  ) => {
    const newUser = signupUser(fullName, email, password)

    setUser(newUser)

    return newUser
  }

  const logout = () => {
    logoutUser()
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error(
      'useAuth must be used inside an AuthProvider',
    )
  }

  return context
}