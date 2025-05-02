export { auth as middleware } from "@/auth";

// Optionally, configure protected routes
// See https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (Auth API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (the root path, public for now)
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|^/$).*)",
  ],
}; 