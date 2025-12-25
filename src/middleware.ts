import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  // Check for session token
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  const isLoginPage = req.nextUrl.pathname.startsWith('/login');

  // If user is already logged in and tries to access login page, redirect to dashboard
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // If no token exists and user is not on login page, redirect to login
  if (!token && !isLoginPage) {
    const url = new URL('/login', req.url);
    url.searchParams.set('callbackUrl', encodeURI(req.url));
    return NextResponse.redirect(url);
  }

  // If token exists, allow access
  return NextResponse.next();
}

export const config = { 
  matcher: ["/"] 
}
