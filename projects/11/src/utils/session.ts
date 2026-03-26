// Simple session utilities
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export const saveSession = (user: User, token: string): void => {
  sessionStorage.setItem('currentUser', JSON.stringify(user))
  sessionStorage.setItem('authToken', token)
}

export const getCurrentUser = (): User | null => {
  const stored = sessionStorage.getItem('currentUser')
  if (!stored) return null
  try {
    return JSON.parse(stored) as User
  } catch {
    return null
  }
}

export const getCurrentToken = (): string | null => {
  return sessionStorage.getItem('authToken')
}

export const clearSession = (): void => {
  sessionStorage.removeItem('currentUser')
  sessionStorage.removeItem('authToken')
}

export const isAuthenticated = (): boolean => {
  return !!getCurrentUser() && !!getCurrentToken()
}

// Export for testing
export const __test__ = {
  saveSession,
  getCurrentUser,
  getCurrentToken,
  clearSession,
  isAuthenticated,
}
