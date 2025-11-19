'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Account from '@/src/pages/Account'
import { getAuthUser } from '@/src/utils/auth'

export default function DashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const user = getAuthUser()
    if (!user) {
      router.push('/login')
    }
  }, [router])

  return <Account />
}

