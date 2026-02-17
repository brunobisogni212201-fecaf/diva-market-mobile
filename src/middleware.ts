import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { ROLES } from '@/lib/auth/rbac'

export async function middleware(request: NextRequest) {
  // 1. Update session (refresh tokens etc)
  let response = await updateSession(request)

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string, value: string, options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // 2. Check Auth Status
  const { data: { user } } = await supabase.auth.getUser()

  const path = request.nextUrl.pathname

  // Public paths that don't need auth
  const isPublicPath = path === '/login' || path === '/register' || path === '/'

  if (!user && !isPublicPath && !path.startsWith('/_next')) {
    // Redirect unauthenticated users to login
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 3. RBAC Checks for Dashboards
  if (user && !path.startsWith('/_next')) {
    // Get user profile to check role
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    const role = profile?.role || ROLES.USUARIA

    // Enforce role-based access
    if (path.startsWith('/admin') && role !== ROLES.ADMIN) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    if (path.startsWith('/vendedora') && role !== ROLES.VENDEDORA) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    if (path.startsWith('/entregadora') && role !== ROLES.ENTREGADORA) {
      return NextResponse.redirect(new URL('/unauthorized', request.url))
    }
    // Note: Cliente area is generally open or we might want to restrict vendors from regular user areas? 
    // Usually admins/vendors also valid "users", but if strictly separated:
    // if (path.startsWith('/cliente') && role !== ROLES.USUARIA) { ... }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
