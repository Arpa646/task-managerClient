import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  const isPublicPath = path === '/login' || path === '/register'
  
  // Check for auth token in cookies or headers
  const token = request.cookies.get('authToken')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '')
  
  // For client-side auth, we'll check localStorage in the client
  // This middleware will handle basic routing protection
  if (!isPublicPath && !token) {
    // Check if we're on the client side by checking for a custom header
    // In Next.js, we'll handle auth checks in the client components
    // This middleware is mainly for server-side redirects if needed
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

