import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}

const fetchJson = async (url, options = {}, token) => {
  const headers = { 'Content-Type': 'application/json', ...options.headers }
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(url, { ...options, headers })
  if (!res.ok) {
    const errData = await res.json().catch(() => ({}))
    throw new Error(errData.error || `HTTP error ${res.status}`)
  }
  return res.json()
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('ajraksha_token'))

  useEffect(() => {
    if (token) {
      fetchProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchProfile = async () => {
    try {
      const data = await fetchJson('/api/auth/profile', {}, token)
      setUser(data.user)
    } catch {
      logout()
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const data = await fetchJson('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('ajraksha_token', data.token)
    return data
  }

  const register = async (userData) => {
    const data = await fetchJson('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    })
    setToken(data.token)
    setUser(data.user)
    localStorage.setItem('ajraksha_token', data.token)
    return data
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('ajraksha_token')
  }

  const updateUser = (updates) => {
    setUser(prev => ({ ...prev, ...updates }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser, token }}>
      {children}
    </AuthContext.Provider>
  )
}
