"use client";

import { useState } from "react";
import type { SidebarData, SidebarLink } from "@/types/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export default function SidebarManagementClient() {
  const queryClient = useQueryClient();
  const { data: sidebar, error, isLoading } = useQuery({
    queryKey: ["sidebar"],
    queryFn: async () => {
      const res = await fetch("/api/admin/sidebar/get");
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json.data;
    },
    staleTime: 0,
  });

  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [addingLinkCatId, setAddingLinkCatId] = useState<string | null>(null);

  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (category: { id: string; title: string; icon?: string; links: SidebarLink[] }) => {
      const res = await fetch("/api/admin/sidebar/add-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebar"] });
      toast.success("Category added");
      setNewCategoryTitle("");
      setAddingCategory(false);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
      setAddingCategory(false);
    },
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const res = await fetch("/api/admin/sidebar/delete-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebar"] });
      toast.success("Category deleted");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
    },
  });

  // Add link mutation
  const addLinkMutation = useMutation({
    mutationFn: async ({ categoryId, link }: { categoryId: string; link: SidebarLink }) => {
      const res = await fetch("/api/admin/sidebar/add-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, link }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebar"] });
      toast.success("Link added");
      setNewLinkTitle("");
      setNewLinkUrl("");
      setAddingLinkCatId(null);
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
    },
  });

  // Delete link mutation
  const deleteLinkMutation = useMutation({
    mutationFn: async ({ categoryId, linkId }: { categoryId: string; linkId: string }) => {
      const res = await fetch("/api/admin/sidebar/delete-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ categoryId, linkId }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebar"] });
      toast.success("Link deleted");
    },
    onError: (err: unknown) => {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
    },
  });

  // Handlers
  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    setAddingCategory(true);
    if (!newCategoryTitle.trim()) {
      toast.error("Category title required");
      setAddingCategory(false);
      return;
    }
    const category = {
      id: newCategoryTitle.toLowerCase().replace(/\s+/g, "-"),
      title: newCategoryTitle,
      icon: undefined,
      links: [],
    };
    addCategoryMutation.mutate(category);
  };

  const handleDeleteCategory = (categoryId: string) => {
    deleteCategoryMutation.mutate(categoryId);
  };

  const handleAddLink = (e: React.FormEvent, categoryId: string) => {
    e.preventDefault();
    if (!newLinkTitle.trim() || !newLinkUrl.trim()) {
      toast.error("Link title and URL required");
      return;
    }
    const link: SidebarLink = {
      id: newLinkTitle.toLowerCase().replace(/\s+/g, "-"),
      title: newLinkTitle,
      url: newLinkUrl,
      icon: undefined,
    };
    addLinkMutation.mutate({ categoryId, link });
  };

  const handleDeleteLink = (categoryId: string, linkId: string) => {
    deleteLinkMutation.mutate({ categoryId, linkId });
  };

  if (isLoading) return <div>Loading sidebar...</div>;
  if (error) return <div className="text-red-500 mb-4">Error loading sidebar: {error.message}</div>;

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
      <div className="space-y-6">
        {sidebar?.categories.map((cat: SidebarData["categories"][number]) => (
          <div key={cat.id} className="border rounded p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-lg">{cat.title}</span>
              <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(cat.id)}>Delete Category</Button>
            </div>
            <ul className="mb-2">
              {cat.links.map((link: SidebarLink) => (
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