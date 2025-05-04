import { getSidebar } from "@/lib/sidebar";
import type { SidebarCategory } from "@/types/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";

interface DynamicSidebarProps {
  className?: string;
}

export default async function DynamicSidebar({ className }: DynamicSidebarProps) {
  const { data, error } = await getSidebar();
  const categories: SidebarCategory[] = data?.categories ?? [];

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
            >
              <ChevronDown className="mr-2 h-4 w-4" />
              {cat.icon && (
                <span className="mr-2">
                  {/* Optionally render icon here if you have a dynamic icon system */}
                </span>
              )}
              {cat.title}
            </div>
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
          </div>
        ))}
      </div>
    </nav>
  );
} 