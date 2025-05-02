import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt", // Using JWT for session strategy
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    // Add callbacks here if needed later (e.g., for roles)
  },
  // Add pages configuration if using custom sign-in page
  // pages: {
  //   signIn: '/auth/signin',
  // }
}); 