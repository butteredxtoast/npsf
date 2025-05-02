/**
 * Represents a single link in the sidebar.
 */
export interface SidebarLink {
  id: string;          // Unique identifier for the link
  title: string;       // Display title
  url: string;         // Target URL when clicked
  icon?: string;       // Optional icon name (e.g., for Lucide icons)
  description?: string; // Optional description or tooltip
}

/**
 * Represents a category of links in the sidebar.
 */
export interface SidebarCategory {
  id: string;          // Unique identifier for the category
  title: string;       // Display title for the category
  icon?: string;       // Optional icon name
  links: SidebarLink[]; // Links within this category
  collapsed?: boolean; // Whether the category is collapsed by default
}

/**
 * Complete sidebar data structure
 */
export interface SidebarData {
  categories: SidebarCategory[];
  version?: number;    // Optional version for tracking changes
  lastUpdated?: string; // Optional timestamp
} 