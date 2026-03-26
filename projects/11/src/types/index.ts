export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  success: boolean
  user?: User
  error?: string
}

export interface AuthContextType {
  user: User | null
  login: (credentials: AuthCredentials) => Promise<AuthResponse>
  logout: () => void
  isLoading: boolean
  updateUser: (updatedUser: User) => void
}
