import { kvGet, kvSet } from "./kv";
import type { UserData, AccessLevel } from "@/types/user";

const userKey = (email: string) => `user:${email.toLowerCase()}`;

/**
 * Retrieves user data from Vercel KV.
 * @param email The user's email address.
 * @returns UserData object or null if not found, plus any error.
 */
export async function getUserData(email: string): Promise<{ data: UserData | null; error: string | null }> {
  if (!email) return { data: null, error: "Email is required" };
  return kvGet<UserData>(userKey(email));
}

/**
 * Adds a new user to Vercel KV.
 * Fails if the user already exists.
 * @param email The user's email address.
 * @param level The user's access level.
 * @returns Error message if operation fails.
 */
export async function addUser(email: string, level: AccessLevel): Promise<{ error: string | null }> {
  if (!email) return { error: "Email is required" };
  const key = userKey(email);
  const userData: UserData = { email: email.toLowerCase(), accessLevel: level };

  try {
    // Remove getClient() call - not needed here
    // const client = getClient(); 

    // Reverting to a check-then-set approach for clarity without complex options
    const existing = await kvGet<UserData>(key);
    if (existing.error) {
        return { error: `Failed to check existing user: ${existing.error}` };
    }
    if (existing.data) {
        return { error: "User already exists" };
    }

    const { error } = await kvSet<UserData>(key, userData);
    return { error };

  } catch (err) {
    console.error(`Error adding user '${email}':`, err);
    const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while adding user";
    return { error: errorMessage };
  }
}

/**
 * Updates an existing user's access level in Vercel KV.
 * Can also be used to add a user if they don't exist (acts like upsert).
 * @param email The user's email address.
 * @param level The new access level.
 * @returns Error message if operation fails.
 */
export async function setUserAccessLevel(email: string, level: AccessLevel): Promise<{ error: string | null }> {
  if (!email) return { error: "Email is required" };
  const key = userKey(email);
  const userData: UserData = { email: email.toLowerCase(), accessLevel: level };

  // Simple set, will overwrite or create
  const { error } = await kvSet<UserData>(key, userData);
  return { error };
}

// Helper functions built on getUserData (can be added as needed)
export async function getUserAccessLevel(email: string): Promise<{ level: AccessLevel | null; error: string | null }> {
    const { data, error } = await getUserData(email);
    if (error) return { level: null, error };
    return { level: data?.accessLevel ?? null, error: null };
}

export async function isAdmin(email: string): Promise<{ isAdmin: boolean; error: string | null }> {
    const { level, error } = await getUserAccessLevel(email);
    if (error) return { isAdmin: false, error };
    return { isAdmin: level === 'admin', error: null };
}

export async function checkUserAccess(email: string): Promise<{ hasAccess: boolean; error: string | null }> {
    const { level, error } = await getUserAccessLevel(email);
    if (error) return { hasAccess: false, error };
    return { hasAccess: level === 'admin' || level === 'active', error: null };
} 