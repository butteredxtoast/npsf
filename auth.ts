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
      console.log("signIn callback triggered for user:", user.email);
      if (!user?.email) {
        console.error("signIn denied: No email found for user.");
        return false; // Deny sign-in if no email
      }

      // Check if user exists in our KV store
      const { data: existingUserData, error: fetchError } = await getUserData(user.email);

      if (fetchError) {
        console.error(`signIn check failed: Error fetching user data for ${user.email}:`, fetchError);
        // Decide if you want to deny sign-in on DB error, or allow but log
        return false; // Deny sign-in if we can't verify user status
      }

      if (!existingUserData) {
        console.log(`User ${user.email} not found in KV. Checking if initial admin.`);
        // User does not exist, check if they are the initial admin
        if (user.email.toLowerCase() === process.env.INITIAL_ADMIN_EMAIL?.toLowerCase()) {
          console.log(`User ${user.email} is the initial admin. Adding to KV.`);
          const { error: addError } = await addUser(user.email, "admin");
          if (addError) {
            console.error(`signIn failed: Error adding initial admin ${user.email}:`, addError);
            return false; // Deny sign-in if adding the initial admin fails
          }
          console.log(`Initial admin ${user.email} added successfully.`);
          return true; // Allow sign-in for the newly added initial admin
        } else {
          console.log(`signIn denied: User ${user.email} not found in KV and is not initial admin.`);
          // User doesn't exist and is not the initial admin
          // Depending on requirements, you might add them as 'active' here,
          // or deny access entirely if only pre-approved users are allowed.
          // For now, deny access if not initial admin and not already in DB.
          return false; // Deny sign-in
        }
      } else {
        console.log(`User ${user.email} found in KV with access level: ${existingUserData.accessLevel}. Allowing sign-in.`);
        // User exists, allow sign-in (access control will happen via middleware/pages)
        return true;
      }
    },

    async jwt({ token, user, account, profile }) {
      // This callback is called first, then the session callback
      // Persist the accessLevel to the token
      if (token?.email) {
        const { data: userData, error } = await getUserData(token.email);
        if (error) {
          console.error(`JWT callback: Error fetching user data for ${token.email}:`, error);
          token.accessLevel = null; // Explicitly set to null on error
        } else {
            token.accessLevel = userData?.accessLevel ?? null;
        }
      }
      return token;
    },

    async session({ session, token }) {
      // Pass the accessLevel from the token to the session object
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