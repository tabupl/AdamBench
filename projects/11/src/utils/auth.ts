// Simple auth utilities for testing
export const validateLogin = (
  email: string,
  password: string
): { valid: boolean; error?: string } => {
  if (!email || !password) {
    return { valid: false, error: 'Email and password are required' }
  }
  if (password.length < 4) {
    return { valid: false, error: 'Password must be at least 4 characters' }
  }
  return { valid: true }
}

export const generateToken = (userId: string, email: string): string => {
  const tokenData = {
    userId,
    email,
    timestamp: Date.now(),
  }
  return btoa(JSON.stringify(tokenData))
}

export const validateToken = (token: string): boolean => {
  try {
    const decoded = atob(token)
    const data = JSON.parse(decoded)
    return !!data.userId && !!data.email && !!data.timestamp
  } catch {
    return false
  }
}

// Export for testing
export const __test__ = {
  validateLogin,
  generateToken,
  validateToken,
}
