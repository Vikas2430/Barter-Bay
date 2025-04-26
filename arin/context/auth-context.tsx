"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

interface User {
  id: string
  username: string
  email: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  login: (token: string, user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check for token in localStorage on initial load
    const token = localStorage.getItem('token')
    if (token) {
      // Fetch user data using token
      fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Invalid token')
          }
          return response.json()
        })
        .then(data => {
          if (data.success) {
            setUser(data.data.user)
            setIsLoggedIn(true)
          }
        })
        .catch(() => {
          // If token is invalid, clear it
          localStorage.removeItem('token')
          setUser(null)
          setIsLoggedIn(false)
        })
    }
  }, [])

  const login = (token: string, user: User) => {
    localStorage.setItem('token', token)
    setUser(user)
    setIsLoggedIn(true)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
    setIsLoggedIn(false)
  }

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 