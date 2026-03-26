import React, { createContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType, AuthCredentials, AuthResponse } from '../types'

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Simple in-memory user store for demo
let currentUser: User | null = null

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user was stored in session
    const storedUser = sessionStorage.getItem('currentUser')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        currentUser = JSON.parse(storedUser)
      } catch {
        sessionStorage.removeItem('currentUser')
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (credentials: AuthCredentials): Promise<AuthResponse> => {
    try {
      setIsLoading(true)

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 800))

      // Simple validation
      if (!credentials.email || !credentials.password) {
        return { success: false, error: 'Email and password are required' }
      }
      if (credentials.password.length < 4) {
        return { success: false, error: 'Password must be at least 4 characters' }
      }

      // Fake user database
      const fakeUsers: User[] = [
        { id: '1', name: 'John Doe', email: 'user@example.com' },
        { id: '2', name: 'Jane Smith', email: 'admin@example.com' },
      ]

      const foundUser = fakeUsers.find(
        (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
      )

      if (!foundUser) {
        return { success: false, error: 'User not found' }
      }

      // Store user in memory and session
      currentUser = foundUser
      sessionStorage.setItem('currentUser', JSON.stringify(foundUser))
      setUser(foundUser)

      return { success: true, user: foundUser }
    } catch (error) {
      return { success: false, error: 'An unexpected error occurred' }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    currentUser = null
    sessionStorage.removeItem('currentUser')
    setUser(null)
  }

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser)
    if (currentUser) {
      currentUser = updatedUser
      sessionStorage.setItem('currentUser', JSON.stringify(updatedUser))
    }
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = React.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
