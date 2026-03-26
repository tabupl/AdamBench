export interface User {
  id: string
  email: string
  name: string
}

const AUTH_TOKEN_KEY = 'auth_token'
const AUTH_USER_KEY = 'auth_user'

const fakeAuthToken = 'fake_jwt_token_12345'

export interface Credential {
  password: string
  name: string
}

export interface UserCredentials {
  email: string
  password: string
  name?: string
}

export class AuthService {
  private static users: Map<string, Credential> = new Map([
    ['admin@example.com', { password: 'password123', name: 'Admin User' }],
    ['user@example.com', { password: 'password123', name: 'Regular User' }],
  ])

  static async validateUser(
    email: string,
    password: string
  ): Promise<User | null> {
    const userCredentials = this.users.get(email.toLowerCase())

    if (!userCredentials || userCredentials.password !== password) {
      return null
    }

    return {
      id: this.generateUserId(),
      email: email.toLowerCase(),
      name: userCredentials.name,
    }
  }

  static async validateUserThrow(
    email: string,
    password: string
  ): Promise<User> {
    const user = await this.validateUser(email, password)

    if (!user) {
      throw new Error('Invalid email or password')
    }

    return user
  }

  static async registerUser(
    email: string,
    password: string,
    name: string
  ): Promise<User> {
    if (this.users.has(email.toLowerCase())) {
      throw new Error('User already exists')
    }

    this.users.set(email.toLowerCase(), { password, name })

    return {
      id: this.generateUserId(),
      email: email.toLowerCase(),
      name,
    }
  }

  static async login(email: string, password: string): Promise<User> {
    const user = await this.validateUserThrow(email, password)
    this.setAuthState(user)
    return user
  }

  static async register(email: string, password: string, name: string): Promise<User> {
    const user = await this.registerUser(email, password, name)
    this.setAuthState(user)
    return user
  }

  static async updateProfile(user: User): Promise<User> {
    // Update user in the users map if email changed
    const email = user.email.toLowerCase()
    const existingCredentials = this.users.get(email)

    if (existingCredentials) {
      this.users.set(email, {
        password: existingCredentials.password,
        name: user.name,
      })
    }

    this.setAuthState(user)
    return user
  }

  static async logout(): Promise<void> {
    this.clearAuthState()
  }

  static async restoreSession(): Promise<User | null> {
    const storedUser = localStorage.getItem(AUTH_USER_KEY)
    if (storedUser) {
      return JSON.parse(storedUser)
    }

    return null
  }

  static isAuthenticated(): boolean {
    return localStorage.getItem(AUTH_TOKEN_KEY) !== null
  }

  static getCurrentUser(): User | null {
    const storedUser = localStorage.getItem(AUTH_USER_KEY)
    return storedUser ? JSON.parse(storedUser) : null
  }

  private static setAuthState(user: User): void {
    localStorage.setItem(AUTH_TOKEN_KEY, fakeAuthToken)
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  }

  private static clearAuthState(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  }

  private static generateUserId(): string {
    return Math.random().toString(36).substring(2, 9)
  }
}
