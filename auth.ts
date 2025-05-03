import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { addUser, getUserData } from "@/lib/users"; // Import user utils
import type { UserData as CustomUserData, AccessLevel } from "@/types/user"; // Import custom types

// Extend the default Session and JWT types
declare module "next-auth" {
  // Augment Session
  interface Session {
    user: {
      id?: string | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      accessLevel?: AccessLevel | null; // Add accessLevel
    };
  }
  // Augment JWT
  interface JWT {
    accessLevel?: AccessLevel | null; // Add accessLevel
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // Optional: Request profile info if needed beyond basic email
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code",
      //     scope: "openid email profile", // Ensure profile scope if needed
      //   },
      // },
    }),
  ],
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!user?.email) {
        return false; // Deny sign-in if no email
      }
      // Check if user exists in our KV store
      const { data: existingUserData, error: fetchError } = await getUserData(user.email);
      if (fetchError) {
        return false; // Deny sign-in if we can't verify user status
      }
      if (!existingUserData) {
        if (user.email.toLowerCase() === process.env.INITIAL_ADMIN_EMAIL?.toLowerCase()) {
          const { error: addError } = await addUser(user.email, "admin");
          if (addError) {
            return false; // Deny sign-in if adding the initial admin fails
          }
          return true; // Allow sign-in for the newly added initial admin
        } else {
          return false; // Deny sign-in
        }
      } else {
        return true;
      }
    },

    async jwt({ token, user }) {
      if (user?.email) {
        token.email = user.email;
      }
      if (!token.email && token.sub) {
        token.email = token.sub;
      }
      if (token?.email) {
        const { data: userData, error } = await getUserData(token.email);
        if (error) {
          token.accessLevel = null;
        } else {
          token.accessLevel = userData?.accessLevel ?? null;
        }
      }
      return token;
    },

    async session({ session, token }) {
      if (token?.accessLevel) {
        session.user.accessLevel = token.accessLevel as AccessLevel;
      }
      return session;
    },
  },
  // Add pages configuration if using custom sign-in/error pages later
  // pages: {
  //   signIn: '/login',
  //   error: '/auth-error', // Error code passed in query string
  // }
}); 