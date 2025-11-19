'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CreateTask from '@/src/pages/CreateTask'
import { isAuthenticated } from '@/src/utils/auth'

export default function CreateTaskPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  return <CreateTask />
}

