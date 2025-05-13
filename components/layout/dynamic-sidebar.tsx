"use client";
import { useState, useEffect } from "react";
import type { SidebarCategory, SidebarData } from "@/types/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { ModeToggle } from "@/components/layout/mode-toggle";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface DynamicSidebarProps {
  className?: string;
}

export default function DynamicSidebar({ className }: DynamicSidebarProps) {
  const [data, setData] = useState<SidebarData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const { data: session } = useSession();
  const user = session?.user;
  const isAdmin = user?.accessLevel === "admin";

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
    <nav className={`flex flex-col h-full w-64 ${className ?? ""}`}>
      <div className="flex-1 space-y-4 py-4">
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
      <div className="px-4 py-3 border-t flex items-center justify-start bg-background mt-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="rounded-full bg-muted p-2 hover:bg-accent transition flex items-center gap-2" aria-label="Open user menu">
              {/* User avatar or initials */}
              {user?.image ? (
                <img src={user.image} alt={user.name || "User"} className="w-8 h-8 rounded-full object-cover" />
              ) : (
                <span className="block w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                  {user?.name ? user.name[0] : "?"}
                </span>
              )}
              {user?.name && (
                <span className="ml-2 max-w-[100px] truncate font-medium text-sm text-foreground">{user.name}</span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-2">
            <div className="flex flex-col items-start gap-2">
              <div className="flex items-center gap-2 w-full border-b pb-2 mb-2">
                {user?.image ? (
                  <img src={user.image} alt={user.name || "User"} className="w-8 h-8 rounded-full object-cover" />
                ) : (
                  <span className="block w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                    {user?.name ? user.name[0] : "?"}
                  </span>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-medium truncate">{user?.name || "User"}</div>
                  <div className="text-xs text-muted-foreground truncate">{user?.email}</div>
                </div>
              </div>
              <ModeToggle />
              {isAdmin && (
                <Link href="/admin" className="w-full px-2 py-1 rounded hover:bg-accent hover:text-accent-foreground transition text-sm font-medium">
                  Admin Dashboard
                </Link>
              )}
              <DropdownMenuItem
                onClick={() => signOut()}
                className="w-full text-left px-2 py-1 rounded hover:bg-destructive hover:text-destructive-foreground transition text-sm font-medium"
              >
                Sign Out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
} 