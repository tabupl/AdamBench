import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoginForm from '../components/LoginForm'

const LoginPage: React.FC = () => {
  const navigate = useNavigate()
  const { login, isLoading } = useAuth()

  const handleLogin = async (email: string, password: string) => {
    const response = await login({ email, password })
    if (response.success) {
      navigate('/dashboard')
    }
    return response
  }

  return <LoginForm onLogin={handleLogin} isLoading={isLoading} />
}

export default LoginPage
