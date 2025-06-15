import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth'; // Assuming verifyToken can handle being called on server

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  const tokenCookie = request.cookies.get('token');
  const token = tokenCookie?.value;

  const isAuthPage = pathname === '/login';
  const isProtectedRoute = pathname.startsWith('/dashboard');
  
  let userPayload = null;
  if (token) {
    try {
      // In middleware, context for verifyToken might differ if it expects browser APIs.
      // Ensure verifyToken is purely based on jwt library and JWT_SECRET.
      userPayload = verifyToken(token);
    } catch (err) {
      // Invalid token, treat as unauthenticated
      console.error("Token verification failed in middleware:", err.message);
    }
  }

  if (isAuthPage) {
    if (userPayload) {
      // If user is authenticated and tries to access login page, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }
    // Allow access to login page if not authenticated
    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (!userPayload) {
      // If user is not authenticated and tries to access a protected route, redirect to login
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirectedFrom', pathname); // Optional: pass redirect info
      return NextResponse.redirect(loginUrl);
    }
    // Allow access to protected route if authenticated
    return NextResponse.next();
  }

  // Allow access to other public pages
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
