"use client";

import { useState, useEffect } from "react";
import { kvGet, kvSet, kvDel } from "@/lib/kv";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TEST_KEY = "kv_test_key";

export default function KVTestPage() {
  const [inputValue, setInputValue] = useState("");
  const [storedValue, setStoredValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetch = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await kvGet<string>(TEST_KEY);
    if (error) {
      setError(error);
      setStoredValue(null);
    } else {
      setStoredValue(data ?? "(Not Set)");
    }
    setLoading(false);
  };

  const handleSet = async () => {
    setLoading(true);
    setError(null);
    const { error } = await kvSet(TEST_KEY, inputValue);
    if (error) {
      setError(error);
    } else {
      setStoredValue(inputValue);
      setInputValue(""); // Clear input on success
    }
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    const { error } = await kvDel(TEST_KEY);
    if (error) {
      setError(error);
    } else {
      setStoredValue("(Deleted)");
    }
    setLoading(false);
  };

  // Fetch initial value on load
  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Vercel KV Test Page</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="mb-4">
        <p>Current value for key &apos;{TEST_KEY}&apos;:</p>
        <pre className="p-2 bg-muted rounded">{storedValue ?? "Loading..."}</pre>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          placeholder="Enter value to set"
          className="flex-grow"
          disabled={loading}
        />
        <Button onClick={handleSet} disabled={loading || !inputValue}>
          Set Value
        </Button>
      </div>

      <div className="flex gap-2">
        <Button onClick={handleFetch} disabled={loading} variant="secondary">
          Refresh Value
        </Button>
        <Button onClick={handleDelete} disabled={loading} variant="destructive">
          Delete Value
        </Button>
      </div>
    </div>
  );
} 