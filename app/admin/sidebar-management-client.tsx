"use client";

import { useState } from "react";
import type { SidebarData, SidebarLink } from "@/types/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface SidebarManagementClientProps {
  initialSidebar: SidebarData | null;
  initialError: string | null;
}

export default function SidebarManagementClient({ initialSidebar, initialError }: SidebarManagementClientProps) {
  const [sidebar, setSidebar] = useState<SidebarData | null>(initialSidebar);
  const [error, setError] = useState<string | null>(initialError);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [addingLinkCatId, setAddingLinkCatId] = useState<string | null>(null);

  // Add category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddingCategory(true);
    if (!newCategoryTitle.trim()) {
      setError("Category title required");
      setAddingCategory(false);
      return;
    }
    const category = {
      id: newCategoryTitle.toLowerCase().replace(/\s+/g, "-"),
      title: newCategoryTitle,
      icon: undefined,
      links: [],
    };
    const res = await fetch("/api/admin/sidebar/add-category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category }),
    });
    const { error } = await res.json();
    if (!error) {
      toast.success("Category added");
      setSidebar(s => s ? { ...s, categories: [...s.categories, category] } : { categories: [category] });
      setNewCategoryTitle("");
    } else {
      toast.error(error);
      setError(error);
    }
    setAddingCategory(false);
  };

  // Delete category
  const handleDeleteCategory = async (categoryId: string) => {
    const res = await fetch("/api/admin/sidebar/delete-category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId }),
    });
    const { error } = await res.json();
    if (!error) {
      toast.success("Category deleted");
      setSidebar(s => s ? { ...s, categories: s.categories.filter(c => c.id !== categoryId) } : s);
    } else {
      toast.error(error);
    }
  };

  // Add link
  const handleAddLink = async (e: React.FormEvent, categoryId: string) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      setError("Link title and URL required");
      return;
    }
    const link: SidebarLink = {
      id: newLinkTitle.toLowerCase().replace(/\s+/g, "-"),
      title: newLinkTitle,
      url: newLinkUrl,
      icon: undefined,
    };
    const res = await fetch("/api/admin/sidebar/add-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, link }),
    });
    const { error } = await res.json();
    if (!error) {
      toast.success("Link added");
      setSidebar(s => s ? {
        ...s,
        categories: s.categories.map(cat =>
          cat.id === categoryId ? { ...cat, links: [...cat.links, link] } : cat
        ),
      } : s);
      setNewLinkTitle("");
      setNewLinkUrl("");
      setAddingLinkCatId(null);
    } else {
      toast.error(error);
      setError(error);
    }
  };

  // Delete link
  const handleDeleteLink = async (categoryId: string, linkId: string) => {
    const res = await fetch("/api/admin/sidebar/delete-link", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ categoryId, linkId }),
    });
    const { error } = await res.json();
    if (!error) {
      toast.success("Link deleted");
      setSidebar(s => s ? {
        ...s,
        categories: s.categories.map(cat =>
          cat.id === categoryId ? { ...cat, links: cat.links.filter(l => l.id !== linkId) } : cat
        ),
      } : s);
    } else {
      toast.error(error);
    }
  };

  return (
    <section id="sidebar">
      <h2 className="text-xl font-semibold mb-4">Sidebar Links Management</h2>
      <form onSubmit={handleAddCategory} className="flex gap-2 mb-6 items-end">
        <Input
          type="text"
          placeholder="New category title"
          value={newCategoryTitle}
          onChange={e => setNewCategoryTitle(e.target.value)}
          className="w-64"
        />
        <Button type="submit" disabled={addingCategory}>Add Category</Button>
      </form>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="space-y-6">
        {sidebar?.categories.map(cat => (
          <div key={cat.id} className="border rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">{cat.title}</span>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(cat.id)}>Delete Category</Button>
            </div>
            <ul className="mb-2">
              {cat.links.map(link => (
                <li key={link.id} className="flex justify-between items-center py-1">
                  <span>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline hover:text-primary transition-colors"
                    >
                      {link.title}
                    </a>
                    <span className="text-muted-foreground"> ({link.url})</span>
                  </span>
                  <Button variant="destructive" size="sm" onClick={() => handleDeleteLink(cat.id, link.id)}>Delete</Button>
                </li>
              ))}
            </ul>
            {addingLinkCatId === cat.id ? (
              <form onSubmit={e => handleAddLink(e, cat.id)} className="flex gap-2 mt-2">
                <Input
                  type="text"
                  placeholder="Link title"
                  value={newLinkTitle}
                  onChange={e => setNewLinkTitle(e.target.value)}
                  className="w-40"
                />
                <Input
                  type="url"
                  placeholder="Link URL"
                  value={newLinkUrl}
                  onChange={e => setNewLinkUrl(e.target.value)}
                  className="w-64"
                />
                <Button type="submit">Add</Button>
                <Button type="button" variant="outline" onClick={() => setAddingLinkCatId(null)}>Cancel</Button>
              </form>
            ) : (
              <Button size="sm" onClick={() => setAddingLinkCatId(cat.id)}>Add Link</Button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
} 