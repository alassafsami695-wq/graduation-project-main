import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
    const token = request.cookies.get('token')?.value
    const pathname = request.nextUrl.pathname

    // Public paths that don't need auth
    const publicPaths = ['/login', '/register', '/', '/courses']
    if (publicPaths.some(path => pathname === path || pathname.startsWith('/courses/'))) {
        return NextResponse.next()
    }

    // If no token and trying to access protected route
    if (!token) {
        // Check if it's a dashboard route or other protected route
        if (pathname.includes('/dashboard') || pathname.includes('/my-courses') || pathname.includes('/profile')) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    // NOTE: In a real app we'd verify the token payload here or call an API to check role.
    // Since we can't easily decode JWT without a library or API call in Edge middleware without overhead,
    // we are relying on client-side redirection for now for role mismatch, 
    // OR we could store role in a cookie as well.

    // For now, basic auth check:
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
