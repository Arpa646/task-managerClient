'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthUser } from '@/src/utils/auth'
import Dashboard from '@/src/pages/Dashboard'

export default function AuthenticatedHomePage() {
  const router = useRouter()

  useEffect(() => {
    const user = getAuthUser()
    if (!user) {
      router.push('/login')
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50">
      <Dashboard />
    </div>
  )
}

