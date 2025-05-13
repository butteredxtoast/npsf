"use client";
import { useState } from "react";
import DynamicSidebar from "./dynamic-sidebar";
// import { auth } from "@/auth"; // Removed: not used here

// NOTE: If you need session/auth logic, handle it in a parent layout or pass as props.
export function MainLayout({ children }: { children: React.ReactNode }) {
  // const isAuthorized = ... // Get from props or context if needed
  const isAuthorized = true; // TEMP: Remove this and restore real logic as needed

  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      {/* Hamburger button for mobile */}
      {isAuthorized && (
        <button
          className="fixed top-4 left-4 z-30 flex flex-col items-center justify-center gap-1 w-10 h-10 rounded bg-muted shadow lg:hidden"
          aria-label="Open sidebar"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="block w-6 h-0.5 bg-foreground" />
          <span className="block w-6 h-0.5 bg-foreground" />
          <span className="block w-6 h-0.5 bg-foreground" />
        </button>
      )}

      {/* Sidebar as overlay on mobile, static on desktop */}
      {isAuthorized && (
        <>
          {/* Mobile drawer */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-20 flex lg:hidden">
              {/* Overlay */}
              <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                onClick={() => setSidebarOpen(false)}
                aria-label="Close sidebar overlay"
              />
              {/* Sidebar drawer */}
              <div className="relative z-30 w-64 h-full bg-background border-r shadow-lg animate-slide-in-left">
                <DynamicSidebar className="h-full" />
              </div>
            </div>
          )}
          {/* Desktop sidebar */}
          <DynamicSidebar className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-background hidden lg:flex" />
        </>
      )}
      <div className={`flex flex-col min-h-screen ${isAuthorized ? 'lg:ml-64' : ''}`}>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </>
  );
} 