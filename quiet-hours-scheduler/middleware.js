import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const { data: { session } } = await supabase.auth.getSession();

  // Protect dashboard and API routes
  if (req.nextUrl.pathname.startsWith('/dashboard') || 
      req.nextUrl.pathname.startsWith('/api/study-blocks')) {
    if (!session) {
      if (req.nextUrl.pathname.startsWith('/api/')) {
        return new Response(
          JSON.stringify({ message: 'Authentication required' }),
          { status: 401, headers: { 'Content-Type': 'application/json' } }
        );
      }
      return NextResponse.redirect(new URL('/auth/signin', req.url));
    }
  }

  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/api/study-blocks/:path*', '/api/users/:path*']
};