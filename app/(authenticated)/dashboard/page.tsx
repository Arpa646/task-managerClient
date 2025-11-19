'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Dashboard from '@/src/pages/Dashboard'
import { getAuthUser } from '@/src/utils/auth'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getAuthUser()
    if (!user) {
      router.push('/login')
    }
  }, [router])

  return <Dashboard />
}

