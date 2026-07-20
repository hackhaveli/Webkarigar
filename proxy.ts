import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function proxy(req) {
    // Admin route: only allow Supreme Admin
    if (req.nextUrl.pathname.startsWith('/admin') || req.nextUrl.pathname.startsWith('/api/admin')) {
      const token = req.nextauth.token;
      if (!token?.email || token.email !== 'coderrohit2927@gmail.com') {
        return NextResponse.redirect(new URL('/dashboard', req.url));
      }
    }
    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/login',
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/templates/:path*', '/admin/:path*', '/api/admin/:path*'],
};
