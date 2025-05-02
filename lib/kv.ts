import { createClient } from "@vercel/kv";

let kvClient: ReturnType<typeof createClient> | null = null;

function getClient() {
  if (kvClient) {
    return kvClient;
  }
  if (
    !process.env.KV_REST_API_URL ||
    !process.env.KV_REST_API_TOKEN
  ) {
    throw new Error("Missing Vercel KV environment variables");
  }

  kvClient = createClient({
    url: process.env.KV_REST_API_URL,
    token: process.env.KV_REST_API_TOKEN,
  });
  return kvClient;
}

// --- Specific KV functions with individual error handling ---

// Read
export async function kvGet<T>(key: string): Promise<{ data: T | null; error: string | null }> {
  try {
    const client = getClient();
    const data = await client.get<T>(key);
    return { data, error: null };
  } catch (err) {
    console.error(`Error during Vercel KV get for key '${key}':`, err);
    const errorMessage = err instanceof Error ? err.message : "An unknown KV error occurred";
    return { data: null, error: errorMessage };
  }
}

// Write (Set - overwrites existing value)
export async function kvSet<T>(key: string, value: T): Promise<{ data: "OK" | null; error: string | null }> {
  try {
    const client = getClient();
    await client.set(key, value);
    // If set succeeds without throwing, return "OK"
    return { data: "OK", error: null };
  } catch (err) {
    console.error(`Error during Vercel KV set for key '${key}':`, err);
    const errorMessage = err instanceof Error ? err.message : "An unknown KV error occurred";
    return { data: null, error: errorMessage };
  }
}

// Update (using JSON merge - partial updates for objects)
// Requires the value at the key to be a JSON object.
export async function kvJsonMerge<T extends object>(key: string, value: Partial<T>): Promise<{ data: "OK" | null; error: string | null }> {
  try {
    const client = getClient();
    // Cast value to Record<string, unknown> as required by json.merge
    const data = await client.json.merge(key, '$', value as Record<string, unknown>);
    return { data, error: null };
  } catch (err) {
    console.error(`Error during Vercel KV json.merge for key '${key}':`, err);
    const errorMessage = err instanceof Error ? err.message : "An unknown KV error occurred";
    return { data: null, error: errorMessage };
  }
}

// Delete
export async function kvDel(key: string | string[]): Promise<{ data: number | null; error: string | null }> {
    const keysToDelete = Array.isArray(key) ? key : [key];
    try {
        const client = getClient();
        const data = await client.del(...keysToDelete);
        return { data, error: null };
    } catch (err) {
        console.error(`Error during Vercel KV del for key(s) '${keysToDelete.join(', ')}':`, err);
        const errorMessage = err instanceof Error ? err.message : "An unknown KV error occurred";
        return { data: null, error: errorMessage };
    }
}

// Check existence
export async function kvExists(key: string | string[]): Promise<{ data: number | null; error: string | null }> {
    const keysToCheck = Array.isArray(key) ? key : [key];
    try {
        const client = getClient();
        const data = await client.exists(...keysToCheck);
        return { data, error: null };
    } catch (err) {
        console.error(`Error during Vercel KV exists for key(s) '${keysToCheck.join(', ')}':`, err);
        const errorMessage = err instanceof Error ? err.message : "An unknown KV error occurred";
        return { data: null, error: errorMessage };
    }
}

// Get all items from a Set
export async function kvSmembers(key: string): Promise<{ data: string[] | null; error: string | null }> {
    try {
        const client = getClient();
        // Assuming smembers returns string[] or null/throws error
        const data = await client.smembers(key);
        return { data, error: null };
    } catch (err) {
        console.error(`Error during Vercel KV smembers for key '${key}':`, err);
        const errorMessage = err instanceof Error ? err.message : "An unknown KV error occurred";
        return { data: null, error: errorMessage };
    }
}

// Add item(s) to a Set
export async function kvSadd(key: string, members: string | string[]): Promise<{ data: number | null; error: string | null }> {
    const membersToAdd = Array.isArray(members) ? members : [members];
    try {
        const client = getClient();
        const data = await client.sadd(key, membersToAdd);
        return { data, error: null };
    } catch (err) {
        console.error(`Error during Vercel KV sadd for key '${key}':`, err);
        const errorMessage = err instanceof Error ? err.message : "An unknown KV error occurred";
        return { data: null, error: errorMessage };
    }
}

// Remove item(s) from a Set
export async function kvSrem(key: string, members: string | string[]): Promise<{ data: number | null; error: string | null }> {
    const membersToRemove = Array.isArray(members) ? members : [members];
    try {
        const client = getClient();
        const data = await client.srem(key, membersToRemove);
        return { data, error: null };
    } catch (err) {
        console.error(`Error during Vercel KV srem for key '${key}':`, err);
        const errorMessage = err instanceof Error ? err.message : "An unknown KV error occurred";
        return { data: null, error: errorMessage };
    }
} 