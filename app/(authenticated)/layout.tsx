'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Sidebar from '@/src/components/Sidebar'
import { getAuthUser, clearAuth, AuthUser } from '@/src/utils/auth'

export default function AuthenticatedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    const checkAuthStatus = () => {
      const authUser = getAuthUser()
      if (authUser) {
        setUser(authUser)
      } else {
        // Only redirect if not on login/register pages
        if (pathname !== '/login' && pathname !== '/register') {
          router.push('/login')
        }
      }
      setLoading(false)
    }
    
    checkAuthStatus()
  }, [router, pathname])

  const logout = () => {
    setUser(null)
    clearAuth()
    router.push('/login')
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-purple-500 border-opacity-75"></div>
          <div className="text-white text-lg font-medium">Loading...</div>
        </div>
      </div>
    )
  }

  // Don't show sidebar on login/register pages
  if (pathname === '/login' || pathname === '/register') {
    return <>{children}</>
  }

  return (
    <div className="min-h-screen bg-black">
      {user && <Sidebar isOpen={sidebarOpen} onToggle={toggleSidebar} user={user} onLogout={logout} />}
      <div className={`${user ? 'lg:ml-72' : ''} transition-all duration-300 pt-20 lg:pt-0`}>
        {children}
      </div>
    </div>
  )
}

