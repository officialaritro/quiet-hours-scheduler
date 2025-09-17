// middleware.js
import { NextResponse } from 'next/server';

export function middleware(request) {
  // Example: block unauthenticated access to /dashboard
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const token = request.cookies.get('auth-token');
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // Otherwise, continue
  return NextResponse.next();
}
