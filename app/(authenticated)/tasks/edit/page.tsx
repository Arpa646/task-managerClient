'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import UpdateTask from '@/src/pages/UpdateTask'
import { isAuthenticated } from '@/src/utils/auth'

export default function EditTaskPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login')
    }
  }, [router])

  return <UpdateTask />
}

