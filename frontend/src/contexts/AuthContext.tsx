import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { ReactNode } from 'react'
import type { User, AuthContextType } from '@/types'
import { authApi } from '@/api/auth.api'
import { TOKEN_KEY, USER_KEY } from '@/constants/storageKeys'

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? (JSON.parse(stored) as User) : null
  })

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY)
  })

  const [isLoading, setIsLoading] = useState(false)

  const isAdmin = user?.perfil === 'Administrador'

  useEffect(() => {
    if (token && !user) {
      setIsLoading(true)
      authApi
        .me()
        .then((userData) => {
          setUser(userData)
          localStorage.setItem(USER_KEY, JSON.stringify(userData))
        })
        .catch(() => {
          setToken(null)
          localStorage.removeItem(TOKEN_KEY)
          localStorage.removeItem(USER_KEY)
        })
        .finally(() => setIsLoading(false))
    }
  }, [token, user])

  const login = useCallback(async (email: string, senha: string) => {
    setIsLoading(true)
    try {
      const { token: newToken, user: userData } = await authApi.login(email, senha)
      localStorage.setItem(TOKEN_KEY, newToken)
      localStorage.setItem(USER_KEY, JSON.stringify(userData))
      setToken(newToken)
      setUser(userData)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setToken(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, isAdmin, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
