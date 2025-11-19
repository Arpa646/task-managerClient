'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { setAuth, AuthUser, getRedirectUrl, clearRedirectUrl } from '@/src/utils/auth'

export default function LoginPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setIsLoading(true)
    setErrors({})
    
    try {
      console.log('Attempting login with:', { email: formData.email })
      
      const response = await fetch(`https://task-manager-server-three-iota.vercel.app/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      })

      console.log('Login response status:', response.status)
      const data = await response.json()
      console.log('Login response data:', data)

      if (response.ok) {
        if (data.token && data.data) {
          setAuth(data.token, data.data)
          
          const redirectUrl = getRedirectUrl()
          if (redirectUrl) {
            console.log('Login successful, redirecting to:', redirectUrl)
            clearRedirectUrl()
            router.push(redirectUrl)
          } else {
            console.log('Login successful, navigating to dashboard')
            router.push('/dashboard')
          }
        } else {
          console.error('Login response missing token or user data:', data)
          setErrors({ general: 'Invalid response from server. Please try again.' })
        }
      } else {
        console.error('Login failed with status:', response.status, data)
        setErrors({ general: data.message || 'Login failed. Please try again.' })
      }
    } catch (error) {
      console.error('Login error:', error)
      setErrors({ general: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-gray-900/80 rounded-2xl shadow-2xl p-8 border border-gray-700 backdrop-blur-sm">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-3 rounded-lg shadow-lg">
                <CalendarIcon className="h-8 w-8 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">Task Manager</span>
            </div>
            <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
            <p className="text-gray-300 mt-2">Sign in to your account to continue</p>
          </div>

          {errors.general && (
            <div className="mb-4 p-4 bg-red-900/30 border border-red-700 rounded-lg backdrop-blur-sm">
              <p className="text-sm text-red-300">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-white placeholder-gray-400 ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-300">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 pr-12 text-white placeholder-gray-400 ${
                    errors.password ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-300">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:ring-4 focus:ring-purple-300/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  <span>Signing In...</span>
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-300">
              Don't have an account?{' '}
              <Link 
                href="/register" 
                className="text-purple-400 font-semibold hover:text-purple-300 transition-colors"
              >
                Sign up here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

