import type { Metadata } from 'next'
import '../src/index.css'
import '../src/App.css'

export const metadata: Metadata = {
  title: 'Task Manager',
  description: 'Manage your tasks efficiently',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-black">
        {children}
      </body>
    </html>
  )
}

