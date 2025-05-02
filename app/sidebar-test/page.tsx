"use client";

import { useState, useEffect } from "react";
import { getSidebar, initializeSidebar, INITIAL_SIDEBAR_DATA } from "@/lib/sidebar";
import { Button } from "@/components/ui/button";
import type { SidebarData } from "@/types/sidebar";

export default function SidebarTestPage() {
  const [sidebarData, setSidebarData] = useState<SidebarData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const fetchSidebar = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await getSidebar();
    if (error) {
      setError(error);
    } else {
      setSidebarData(data);
    }
    setLoading(false);
  };

  const handleInitialize = async () => {
    setLoading(true);
    setError(null);
    const { error } = await initializeSidebar();
    if (error) {
      setError(error);
    } else {
      setInitialized(true);
      await fetchSidebar(); // Refresh the data after initialization
    }
    setLoading(false);
  };

  // Fetch initial data on load
  useEffect(() => {
    fetchSidebar();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Sidebar Data Test</h1>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="flex gap-4 mb-6">
        <Button onClick={fetchSidebar} disabled={loading} variant="secondary">
          Refresh Data
        </Button>
        <Button onClick={handleInitialize} disabled={loading}>
          Initialize Sidebar
        </Button>
      </div>

      {initialized && (
        <div className="mb-4 p-2 bg-green-100 dark:bg-green-900 rounded">
          <p>Sidebar data initialized successfully!</p>
        </div>
      )}

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Current Sidebar Data:</h2>
        {sidebarData ? (
          <div className="bg-muted rounded p-4">
            <pre className="whitespace-pre-wrap overflow-auto max-h-[600px]">
              {JSON.stringify(sidebarData, null, 2)}
            </pre>
          </div>
        ) : (
          <p>No sidebar data found. Click &quot;Initialize Sidebar&quot; to create default data.</p>
        )}
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Default Sidebar Data:</h2>
        <div className="bg-muted rounded p-4">
          <pre className="whitespace-pre-wrap overflow-auto max-h-[300px]">
            {JSON.stringify(INITIAL_SIDEBAR_DATA, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  );
} 