import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest, getAuthToken, setAuthToken } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(() => Boolean(getAuthToken()))

  useEffect(() => {
    const token = getAuthToken()
    if (!token) return

    apiRequest('/auth/me')
      .then(({ user: currentUser }) => setUser(currentUser))
      .catch((error) => {
        if (error.status === 401) {
          setAuthToken(null)
          setUser(null)
          return
        }
        console.error('Unable to restore the signed-in user:', error)
      })
      .finally(() => setLoading(false))
  }, [])

  const signIn = async (credentials) => {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    setAuthToken(result.token)
    setUser(result.user)
    return result.user
  }

  const signInAsAdmin = async (credentials) => {
    const result = await apiRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    })
    setAuthToken(result.token)
    setUser(result.user)
    return result.user
  }

  const signUp = async (details) => {
    const result = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details),
    })
    setAuthToken(result.token)
    setUser(result.user)
    return result.user
  }

  const signOut = () => {
    setAuthToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({ user, loading, signIn, signInAsAdmin, signUp, signOut }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside an AuthProvider')
  }
  return context
}
