import { NextResponse } from 'next/server'
import { auth } from "@/auth"; // Import the auth helper
import type { AccessLevel } from '@/types/user';

const ADMIN_ROUTES = ['/admin']; // Add admin-specific route prefixes here later
const UNAUTHORIZED_REDIRECT = '/unauthorized';
const LOGIN_REDIRECT = '/api/auth/signin'; // Default NextAuth sign-in page

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, including auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - unauthorized (the unauthorized page itself)
     * - / (the root path, allow public access for now)
     * Public assets in /public are implicitly excluded
     */
    "/((?!api|_next/static|_next/image|favicon.ico|unauthorized|^/$).*)",
  ],
};

export default auth((req) => {
  const sessionToken = req.auth;
  const requestedPath = req.nextUrl.pathname;

  // User is logged in, check access level
  const userAccessLevel = sessionToken?.user?.accessLevel as AccessLevel | null | undefined;

  if (userAccessLevel !== 'admin' && userAccessLevel !== 'active') {
    if (requestedPath === UNAUTHORIZED_REDIRECT) {
      return NextResponse.next();
    }
    const unauthorizedUrl = new URL(UNAUTHORIZED_REDIRECT, req.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  return NextResponse.next();
}); 