import { kvGet, kvSet } from "./kv";
import type { SidebarData, SidebarCategory, SidebarLink } from "@/types/sidebar";

// Key for storing all sidebar data
const SIDEBAR_KEY = "sidebar:data";

/**
 * Retrieves the complete sidebar data from Vercel KV.
 * @returns The sidebar data or null if not found, plus any error.
 */
export async function getSidebar(): Promise<{ data: SidebarData | null; error: string | null }> {
  return kvGet<SidebarData>(SIDEBAR_KEY);
}

/**
 * Stores the complete sidebar data to Vercel KV.
 * @param sidebarData The sidebar data to store.
 * @returns Error message if the operation fails.
 */
export async function setSidebar(sidebarData: SidebarData): Promise<{ error: string | null }> {
  // Update the lastUpdated timestamp
  const updatedData: SidebarData = {
    ...sidebarData,
    lastUpdated: new Date().toISOString(),
    version: (sidebarData.version || 0) + 1,
  };

  const { error } = await kvSet<SidebarData>(SIDEBAR_KEY, updatedData);
  return { error };
}

/**
 * Adds a new category to the sidebar.
 * @param category The category to add.
 * @returns Error message if the operation fails.
 */
export async function addCategory(category: SidebarCategory): Promise<{ error: string | null }> {
  // Validate the new category
  if (!category.id) {
    return { error: "Category ID is required" };
  }
  if (!category.title) {
    return { error: "Category title is required" };
  }

  // Initialize links array if not provided
  if (!category.links) {
    category.links = [];
  }

  const { data: existingData, error: getError } = await getSidebar();
  if (getError) {
    return { error: `Failed to fetch existing sidebar data: ${getError}` };
  }

  const newData: SidebarData = existingData 
    ? { ...existingData }
    : { categories: [] };

  // Check if category with same ID already exists
  if (newData.categories.some(c => c.id === category.id)) {
    return { error: `Category with ID '${category.id}' already exists` };
  }

  // Add the new category
  newData.categories.push(category);

  return setSidebar(newData);
}

/**
 * Updates an existing category in the sidebar.
 * @param categoryId The ID of the category to update.
 * @param updates The updates to apply to the category.
 * @returns Error message if the operation fails.
 */
export async function updateCategory(
  categoryId: string, 
  updates: Partial<Omit<SidebarCategory, 'id' | 'links'>>
): Promise<{ error: string | null }> {
  if (!categoryId) {
    return { error: "Category ID is required" };
  }

  const { data: existingData, error: getError } = await getSidebar();
  if (getError) {
    return { error: `Failed to fetch existing sidebar data: ${getError}` };
  }
  if (!existingData) {
    return { error: "Sidebar data not found" };
  }

  const categoryIndex = existingData.categories.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) {
    return { error: `Category with ID '${categoryId}' not found` };
  }

  // Apply updates, preserving existing properties not in updates
  const updatedCategory = {
    ...existingData.categories[categoryIndex],
    ...updates,
  };

  // Replace the category in the array
  const newCategories = [...existingData.categories];
  newCategories[categoryIndex] = updatedCategory;

  return setSidebar({
    ...existingData,
    categories: newCategories,
  });
}

/**
 * Deletes a category from the sidebar.
 * @param categoryId The ID of the category to delete.
 * @returns Error message if the operation fails.
 */
export async function deleteCategory(categoryId: string): Promise<{ error: string | null }> {
  if (!categoryId) {
    return { error: "Category ID is required" };
  }

  const { data: existingData, error: getError } = await getSidebar();
  if (getError) {
    return { error: `Failed to fetch existing sidebar data: ${getError}` };
  }
  if (!existingData) {
    return { error: "Sidebar data not found" };
  }

  if (!existingData.categories.some(c => c.id === categoryId)) {
    return { error: `Category with ID '${categoryId}' not found` };
  }

  // Filter out the category to delete
  const newCategories = existingData.categories.filter(c => c.id !== categoryId);

  return setSidebar({
    ...existingData,
    categories: newCategories,
  });
}

/**
 * Adds a new link to a category.
 * @param categoryId The ID of the category to add the link to.
 * @param link The link to add.
 * @returns Error message if the operation fails.
 */
export async function addLink(
  categoryId: string, 
  link: SidebarLink
): Promise<{ error: string | null }> {
  if (!categoryId) {
    return { error: "Category ID is required" };
  }
  if (!link.id) {
    return { error: "Link ID is required" };
  }
  if (!link.title) {
    return { error: "Link title is required" };
  }
  if (!link.url) {
    return { error: "Link URL is required" };
  }

  const { data: existingData, error: getError } = await getSidebar();
  if (getError) {
    return { error: `Failed to fetch existing sidebar data: ${getError}` };
  }
  if (!existingData) {
    return { error: "Sidebar data not found" };
  }

  const categoryIndex = existingData.categories.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) {
    return { error: `Category with ID '${categoryId}' not found` };
  }

  const category = existingData.categories[categoryIndex];
  
  // Check if link with same ID already exists in this category
  if (category.links.some(l => l.id === link.id)) {
    return { error: `Link with ID '${link.id}' already exists in category '${categoryId}'` };
  }

  // Add the new link to the category
  const updatedCategory = {
    ...category,
    links: [...category.links, link],
  };

  // Replace the category in the array
  const newCategories = [...existingData.categories];
  newCategories[categoryIndex] = updatedCategory;

  return setSidebar({
    ...existingData,
    categories: newCategories,
  });
}

/**
 * Updates an existing link in a category.
 * @param categoryId The ID of the category containing the link.
 * @param linkId The ID of the link to update.
 * @param updates The updates to apply to the link.
 * @returns Error message if the operation fails.
 */
export async function updateLink(
  categoryId: string, 
  linkId: string, 
  updates: Partial<Omit<SidebarLink, 'id'>>
): Promise<{ error: string | null }> {
  if (!categoryId) {
    return { error: "Category ID is required" };
  }
  if (!linkId) {
    return { error: "Link ID is required" };
  }

  const { data: existingData, error: getError } = await getSidebar();
  if (getError) {
    return { error: `Failed to fetch existing sidebar data: ${getError}` };
  }
  if (!existingData) {
    return { error: "Sidebar data not found" };
  }

  const categoryIndex = existingData.categories.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) {
    return { error: `Category with ID '${categoryId}' not found` };
  }

  const category = existingData.categories[categoryIndex];
  const linkIndex = category.links.findIndex(l => l.id === linkId);
  if (linkIndex === -1) {
    return { error: `Link with ID '${linkId}' not found in category '${categoryId}'` };
  }

  // Apply updates, preserving existing properties not in updates
  const updatedLink = {
    ...category.links[linkIndex],
    ...updates,
  };

  // Replace the link in the category
  const updatedLinks = [...category.links];
  updatedLinks[linkIndex] = updatedLink;

  const updatedCategory = {
    ...category,
    links: updatedLinks,
  };

  // Replace the category in the array
  const newCategories = [...existingData.categories];
  newCategories[categoryIndex] = updatedCategory;

  return setSidebar({
    ...existingData,
    categories: newCategories,
  });
}

/**
 * Deletes a link from a category.
 * @param categoryId The ID of the category containing the link.
 * @param linkId The ID of the link to delete.
 * @returns Error message if the operation fails.
 */
export async function deleteLink(
  categoryId: string, 
  linkId: string
): Promise<{ error: string | null }> {
  if (!categoryId) {
    return { error: "Category ID is required" };
  }
  if (!linkId) {
    return { error: "Link ID is required" };
  }

  const { data: existingData, error: getError } = await getSidebar();
  if (getError) {
    return { error: `Failed to fetch existing sidebar data: ${getError}` };
  }
  if (!existingData) {
    return { error: "Sidebar data not found" };
  }

  const categoryIndex = existingData.categories.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) {
    return { error: `Category with ID '${categoryId}' not found` };
  }

  const category = existingData.categories[categoryIndex];
  if (!category.links.some(l => l.id === linkId)) {
    return { error: `Link with ID '${linkId}' not found in category '${categoryId}'` };
  }

  // Filter out the link to delete
  const updatedLinks = category.links.filter(l => l.id !== linkId);

  const updatedCategory = {
    ...category,
    links: updatedLinks,
  };

  // Replace the category in the array
  const newCategories = [...existingData.categories];
  newCategories[categoryIndex] = updatedCategory;

  return setSidebar({
    ...existingData,
    categories: newCategories,
  });
}

/**
 * Sample initial sidebar data for a new installation.
 */
export const INITIAL_SIDEBAR_DATA: SidebarData = {
  categories: [
    {
      id: "general",
      title: "General",
      icon: "Home",
      links: [
        {
          id: "dashboard",
          title: "Dashboard",
          url: "/",
          icon: "LayoutDashboard",
        },
        {
          id: "calendar",
          title: "Calendar",
          url: "/calendar",
          icon: "Calendar",
        },
      ],
    },
    {
      id: "resources",
      title: "Resources",
      icon: "FileText",
      links: [
        {
          id: "group-info",
          title: "Group Information",
          url: "/resources/group-info",
          icon: "Info",
        },
        {
          id: "routes",
          title: "Running Routes",
          url: "/resources/routes",
          icon: "MapPin",
        },
      ],
    },
  ],
  version: 1,
  lastUpdated: new Date().toISOString(),
};

/**
 * Initializes the sidebar with default data if it doesn't exist.
 * @returns Error message if the operation fails.
 */
export async function initializeSidebar(): Promise<{ error: string | null }> {
  const { data: existingData, error: getError } = await getSidebar();
  
  // If there was an error fetching or the data exists, don't initialize
  if (getError) {
    return { error: `Failed to check existing sidebar data: ${getError}` };
  }
  
  if (existingData) {
    return { error: null }; // Data already exists, no error
  }
  
  // Initialize with default data
  return setSidebar(INITIAL_SIDEBAR_DATA);
} 