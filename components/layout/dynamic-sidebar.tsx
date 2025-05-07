"use client";
import { useState, useEffect } from "react";
import type { SidebarCategory, SidebarData } from "@/types/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

interface DynamicSidebarProps {
  className?: string;
}

export default function DynamicSidebar({ className }: DynamicSidebarProps) {
  const [data, setData] = useState<SidebarData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  // Fetch sidebar data client-side from API
  useEffect(() => {
    fetch("/api/admin/sidebar/get")
      .then((res) => res.json())
      .then(({ data, error }) => {
        setData(data);
        setError(error);
        // Default all categories to expanded
        if (data?.categories) {
          setCollapsed(
            Object.fromEntries(data.categories.map((cat: SidebarCategory) => [cat.id, false]))
          );
        }
      })
      .catch(() => setError("Failed to fetch sidebar data"));
  }, []);

  const categories: SidebarCategory[] = data?.categories ?? [];

  const handleToggle = (catId: string) => {
    setCollapsed((prev) => ({ ...prev, [catId]: !prev[catId] }));
  };

  if (error) {
    return (
      <div className={className}>
        <p className="text-red-500 p-4">Sidebar failed to load: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={className}>
        <Skeleton className="h-8 w-3/4 mb-2" />
        <Skeleton className="h-6 w-1/2 mb-2" />
        <Skeleton className="h-8 w-3/4 mb-2" />
      </div>
    );
  }

  return (
    <nav className={`pb-12 ${className ?? ""}`}>
      <div className="space-y-4 py-4">
        {categories.map((cat) => (
          <div key={cat.id} className="px-3 py-2">
            <div
              className="flex items-center w-full px-4 py-2 text-lg font-semibold tracking-tight hover:bg-muted rounded transition select-none cursor-pointer"
              onClick={() => handleToggle(cat.id)}
            >
              <ChevronDown
                className={`mr-2 h-4 w-4 transition-transform duration-200 ${collapsed[cat.id] ? "rotate-0" : "rotate-180"}`}
              />
              {cat.icon && (
                <span className="mr-2">
                  {/* Optionally render icon here if you have a dynamic icon system */}
                </span>
              )}
              {cat.title}
            </div>
            { !collapsed[cat.id] && (
              <div
                id={`sidebar-cat-${cat.id}`}
                className={`ml-6 mt-2 space-y-1`}
              >
                {cat.links.length === 0 ? (
                  <span className="text-muted-foreground text-sm">No links</span>
                ) : (
                  cat.links.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition text-sm"
                    >
                      {link.icon && (
                        <span className="mr-2">
                          {/* Optionally render icon here if you have a dynamic icon system */}
                        </span>
                      )}
                      {link.title}
                    </a>
                  ))
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
} 