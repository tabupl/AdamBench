import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User } from '../types'

interface AuthProviderProps {
  children: ReactNode
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user database
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'admin@example.com',
    role: 'admin'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'user@example.com',
    role: 'user'
  }
]

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('authUser')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch {
        localStorage.removeItem('authUser')
      }
    }
    setLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true)

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800))

      // Find user by email
      const foundUser = mockUsers.find(u => u.email === email)

      // Simple validation: password must be at least 6 characters
      if (!foundUser || password.length < 6) {
        return false
      }

      // Save user to localStorage
      localStorage.setItem('authUser', JSON.stringify(foundUser))
      setUser(foundUser)
      return true
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('authUser')
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    logout
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}