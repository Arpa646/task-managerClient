'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { EyeIcon, EyeSlashIcon, CalendarIcon } from '@heroicons/react/24/outline'
import { API_CONFIG } from '@/src/config'
import { setAuth, AuthUser, getRedirectUrl, clearRedirectUrl } from '@/src/utils/auth'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({ first_name: '', last_name: '', email: '', password: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    if (!formData.first_name) newErrors.first_name = 'First name is required'
    else if (formData.first_name.length < 2) newErrors.first_name = 'First name must be at least 2 characters'
    if (!formData.last_name) newErrors.last_name = 'Last name is required'
    else if (formData.last_name.length < 2) newErrors.last_name = 'Last name must be at least 2 characters'
    if (!formData.email) newErrors.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid'
    if (!formData.password) newErrors.password = 'Password is required'
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsLoading(true)
    try {
      const formDataToSend = new FormData()
      formDataToSend.append('first_name', formData.first_name)
      formDataToSend.append('last_name', formData.last_name)
      formDataToSend.append('email', formData.email)
      formDataToSend.append('password', formData.password)
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.SIGNUP}`, {
        method: 'POST',
        body: formDataToSend
      })
      const data = await response.json()
      if (response.ok) {
        // After successful signup, go directly to tasks page
        router.push('/tasks')
      } else {
        const errorMessage = data.message || data.error || data.detail || 'Registration failed. Please try again.'
        if (errorMessage.includes('email') && (errorMessage.includes('exists') || errorMessage.includes('already'))) {
          setErrors({ email: 'An account with this email already exists. Please use a different email or try logging in.', general: '' })
        } else {
          setErrors({ general: errorMessage })
        }
      }
    } catch (error) {
      setErrors({ general: 'Network error. Please check your connection and try again.' })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="flex w-full max-w-4xl shadow-2xl rounded-2xl overflow-hidden border border-gray-200">
        {/* Left illustration panel */}
        <div className="hidden md:flex flex-col justify-center items-center bg-blue-50 w-1/2 p-10 relative">
          <div className="flex flex-col items-center">
            {/* SVG illustration matching Figma style */}
            <svg width="260" height="220" viewBox="0 0 260 220" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="30" y="40" width="200" height="140" rx="20" fill="#E0E7FF" />
              <rect x="70" y="70" width="120" height="80" rx="12" fill="#6366F1" />
              <rect x="90" y="90" width="80" height="40" rx="8" fill="#A5B4FC" />
              <circle cx="160" cy="110" r="16" fill="#F59E42" />
              <rect x="110" y="120" width="40" height="10" rx="5" fill="#6366F1" />
              <rect x="110" y="135" width="40" height="10" rx="5" fill="#6366F1" />
              {/* Add more shapes for detail if needed */}
            </svg>
            <div className="mt-8 text-center">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">Sign Up</h2>
              <p className="text-blue-700">Create your account and start managing tasks</p>
            </div>
          </div>
        </div>
        {/* Right form panel */}
        <div className="w-full md:w-1/2 bg-white flex flex-col justify-center p-10">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create your account</h2>
            <p className="text-gray-500 mt-2">Start managing your tasks efficiently</p>
          </div>
          {errors.general && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  id="first_name"
                  name="first_name"
                  type="text"
                  value={formData.first_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 text-gray-900 placeholder-gray-400 ${errors.first_name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your first name"
                />
                {errors.first_name && (
                  <p className="mt-2 text-xs text-red-600">{errors.first_name}</p>
                )}
              </div>
              <div className="w-1/2">
                <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  id="last_name"
                  name="last_name"
                  type="text"
                  value={formData.last_name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 text-gray-900 placeholder-gray-400 ${errors.last_name ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your last name"
                />
                {errors.last_name && (
                  <p className="mt-2 text-xs text-red-600">{errors.last_name}</p>
                )}
              </div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 text-gray-900 placeholder-gray-400 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="mt-2 text-xs text-red-600">{errors.email}</p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 pr-12 text-gray-900 placeholder-gray-400 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-blue-600 transition-colors" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-xs text-red-600">{errors.password}</p>
              )}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                  <span>Sign Up...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </button>
          </form>
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 font-semibold hover:text-blue-500 transition-colors">Log in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

