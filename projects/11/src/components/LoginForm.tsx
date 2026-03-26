import React, { useState } from 'react'
import { AuthCredentials } from '../types'

interface LoginFormProps {
  onLogin: (email: string, password: string) => Promise<any>
  isLoading?: boolean
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, isLoading = false }) => {
  const [credentials, setCredentials] = useState<AuthCredentials>({
    email: 'user@example.com',
    password: 'password123',
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      const response = await onLogin(credentials.email, credentials.password)
      if (response && !response.success) {
        setError(response.error || 'Invalid credentials')
      }
    } catch (err) {
      setError('An error occurred during login')
    }
  }

  const handleDemoLogin = () => {
    setCredentials({
      email: 'user@example.com',
      password: 'password123',
    })
  }

  const handleInputChange = (field: keyof AuthCredentials) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({
      ...prev,
      [field]: e.target.value,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl">
        <div>
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Welcome Back
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sign in to your account
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your email"
                value={credentials.email}
                onChange={handleInputChange('email')}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="Enter your password"
                value={credentials.password}
                onChange={handleInputChange('password')}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">Demo credentials:</p>
          <p className="text-xs text-gray-500">user@example.com / any 4+ characters</p>
          <button
            type="button"
            onClick={handleDemoLogin}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Use demo credentials
          </button>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
