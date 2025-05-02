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
  // req.auth contains session information (from the JWT callback)
  const sessionToken = req.auth;
  const requestedPath = req.nextUrl.pathname;

  // If user is not logged in (no session token)
  if (!sessionToken) {
    console.log(`Middleware: No session token found for path ${requestedPath}. Redirecting to login.`);
    const loginUrl = new URL(LOGIN_REDIRECT, req.url);
    // You might want to add a callbackUrl to redirect back after login
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  // User is logged in, check access level
  // Check for property existence before casting/using
  const userAccessLevel = (
    sessionToken && typeof sessionToken === 'object' && 'accessLevel' in sessionToken
      ? sessionToken.accessLevel
      : null
  ) as AccessLevel | null | undefined;

  console.log(`Middleware: User ${sessionToken?.user?.email} accessing ${requestedPath} with level ${userAccessLevel}`);

  // Check for general dashboard access (admin or active)
  if (userAccessLevel !== 'admin' && userAccessLevel !== 'active') {
    console.log(`Middleware: User ${sessionToken?.user?.email} lacks access ('${userAccessLevel}'). Redirecting to unauthorized.`);
    // If already on the unauthorized page, do nothing to prevent redirect loop
    if (requestedPath === UNAUTHORIZED_REDIRECT) {
      return NextResponse.next();
    }
    const unauthorizedUrl = new URL(UNAUTHORIZED_REDIRECT, req.url);
    return NextResponse.redirect(unauthorizedUrl);
  }

  // Optional: Check for admin-specific routes (add later if needed)
  // const isAdminRoute = ADMIN_ROUTES.some(route => requestedPath.startsWith(route));
  // if (isAdminRoute && userAccessLevel !== 'admin') {
  //   console.log(`Middleware: User ${sessionToken.user?.email} lacks ADMIN access for ${requestedPath}. Redirecting.`);
  //   const unauthorizedUrl = new URL(UNAUTHORIZED_REDIRECT, req.url);
  //    return NextResponse.redirect(unauthorizedUrl);
  // }

  // If all checks pass, allow the request
  console.log(`Middleware: User ${sessionToken?.user?.email} access granted for ${requestedPath}.`);
  return NextResponse.next();
}); 