import React from "react";
import { cn } from "@/lib/utils";

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            {/* Placeholder for links */}
            <p className="p-4 text-sm text-muted-foreground">Links Loading...</p>
          </div>
        </div>
      </div>
    </div>
  );
} 