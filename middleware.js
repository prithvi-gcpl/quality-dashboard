import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC = ['/login', '/api/auth/login'];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  if (PUBLIC.includes(pathname)) return NextResponse.next();

  let payload = null;
  const token = req.cookies.get('gcpl_session')?.value;
  if (token && process.env.AUTH_SECRET) {
    try {
      ({ payload } = await jwtVerify(token, new TextEncoder().encode(process.env.AUTH_SECRET)));
    } catch { /* invalid or expired */ }
  }

  if (!payload) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/admin') && payload.role !== 'admin') {
    const url = req.nextUrl.clone();
    url.pathname = '/';
    url.search = '';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|gcpl-logo.png|godrej-signature.png).*)'],
};
