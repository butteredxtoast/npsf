"use client";

import React from "react";
import { Header } from "./header";
import { Sidebar } from "./sidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <div className="flex flex-1">
        <Sidebar className="hidden lg:block w-64 border-r" />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
} 