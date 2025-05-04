import { NextResponse } from 'next/server'
import { auth } from "@/auth"; // Import the auth helper
import type { AccessLevel } from '@/types/user';

const LOGIN_REDIRECT = '/api/auth/signin'; // Default NextAuth sign-in page

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
  ],
};

export default auth((req) => {
  const sessionToken = req.auth;
  const requestedPath = req.nextUrl.pathname;

  // User is logged in, check access level
  const userAccessLevel = sessionToken?.user?.accessLevel as AccessLevel | null | undefined;

  if (userAccessLevel !== 'admin' && userAccessLevel !== 'active') {
    // Redirect to / with error query param
    const rootUrl = new URL('/', req.url);
    rootUrl.searchParams.set('error', 'unauthorized');
    return NextResponse.redirect(rootUrl);
  }

  return NextResponse.next();
}); 