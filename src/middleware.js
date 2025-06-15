
import { NextResponse } from 'next/server';
import { getSessionFromRequest, sessionOptions } from '@/lib/auth'; // Using getSessionFromRequest for middleware

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // For iron-session, get the session using request.cookies
  // Note: getIronSession (used by getSessionFromRequest) can work with request.cookies directly.
  const session = await getSessionFromRequest(request.cookies); 
  const isAuthenticated = !!(session && session.user && session.user.userId);

  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isProtectedRoute = pathname.startsWith('/dashboard');
  const isApiAuthRoute = pathname.startsWith('/api/auth/login') || pathname.startsWith('/api/auth/register');

  if (isAuthPage) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!isAuthenticated) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }
  
  // Allow access to public API routes like login/register without further checks here
  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  // For other API routes, you might want to add protection if they aren't covered by page-level checks
  // or if they are meant to be protected. For now, assuming /api/candidates/* are handled by session checks within the route handlers.

  return NextResponse.next();
}

export const config = {
  // Apply middleware to authentication pages, dashboard, and relevant API routes
  // Exclude public assets and _next internal routes
  matcher: [
    '/dashboard/:path*', 
    '/login', 
    '/register',
    // '/api/((?!auth/login|auth/register|auth/logout).*)', // Example: Protect API routes other than auth
  ],
};
