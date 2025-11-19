'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Tasks from '@/src/pages/Tasks'
import { isAuthenticated } from '@/src/utils/auth'

export default function TasksPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  return <Tasks />
}

