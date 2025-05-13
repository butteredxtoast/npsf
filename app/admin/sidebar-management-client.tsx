"use client";

import { useState, useRef, useEffect } from "react";
import type { SidebarData, SidebarLink } from "@/types/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useDrag, useDrop } from "react-dnd";
import { ItemTypes } from "@/types/dnd";

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
  const [addingLinkCatId, setAddingLinkCatId] = useState<string | null>(null);
  const [categories, setCategories] = useState<SidebarData["categories"]>(sidebar?.categories || []);

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

  // Add setSidebarMutation for persisting order
  const setSidebarMutation = useMutation({
    mutationFn: async (newSidebar: SidebarData) => {
      const res = await fetch("/api/admin/sidebar/set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sidebarData: newSidebar }),
      });
      const json = await res.json();
      if (json.error) throw new Error(json.error);
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sidebar"] });
      toast.success("Sidebar order updated");
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

  // Move category handler
  const moveCategory = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const updated = [...categories];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, moved);
    setCategories(updated);
    // Persist to backend
    if (sidebar) setSidebarMutation.mutate({ ...sidebar, categories: updated });
  };

  // Move link handler
  const moveLink = (catIndex: number, fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;
    const updated = [...categories];
    const links = [...updated[catIndex].links];
    const [moved] = links.splice(fromIndex, 1);
    links.splice(toIndex, 0, moved);
    updated[catIndex] = { ...updated[catIndex], links };
    setCategories(updated);
    // Persist to backend
    if (sidebar) setSidebarMutation.mutate({ ...sidebar, categories: updated });
  };

  // DnD Category component
  function SidebarCategory({ cat, index }: { cat: SidebarData["categories"][number]; index: number }) {
    const ref = useRef<HTMLDivElement>(null);
    const [newLinkTitle, setNewLinkTitle] = useState("");
    const [newLinkUrl, setNewLinkUrl] = useState("");
    const [, drop] = useDrop({
      accept: ItemTypes.CATEGORY,
      hover(item: { index: number }) {
        if (item.index !== index) {
          moveCategory(item.index, index);
          item.index = index;
        }
      },
    });
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.CATEGORY,
      item: { id: cat.id, index },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });
    drag(drop(ref));

    const handleAddLink = (e: React.FormEvent) => {
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
      addLinkMutation.mutate({ categoryId: cat.id, link }, {
        onSuccess: () => {
          setNewLinkTitle("");
          setNewLinkUrl("");
          setAddingLinkCatId(null);
        }
      });
    };

    return (
      <div ref={ref} className="border rounded p-4" style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div className="flex justify-between items-center mb-2">
          <span className="font-semibold text-lg cursor-move">{cat.title}</span>
          <Button variant="destructive" size="sm" onClick={() => handleDeleteCategory(cat.id)}>Delete Category</Button>
        </div>
        <ul className="mb-2">
          {cat.links.map((link, linkIdx) => (
            <SidebarLinkItem
              key={link.id}
              link={link}
              catId={cat.id}
              catIndex={index}
              index={linkIdx}
              moveLink={moveLink}
            />
          ))}
        </ul>
        {addingLinkCatId === cat.id ? (
          <form onSubmit={handleAddLink} className="flex gap-2 mt-2">
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
    );
  }

  // DnD Link component
  function SidebarLinkItem({ link, catId, catIndex, index, moveLink }: {
    link: SidebarLink;
    catId: string;
    catIndex: number;
    index: number;
    moveLink: (catIndex: number, fromIndex: number, toIndex: number) => void;
  }) {
    const ref = useRef<HTMLLIElement>(null);
    const [, drop] = useDrop({
      accept: ItemTypes.LINK,
      hover(item: { index: number; catIndex: number }) {
        if (item.catIndex === catIndex && item.index !== index) {
          moveLink(catIndex, item.index, index);
          item.index = index;
        }
      },
    });
    const [{ isDragging }, drag] = useDrag({
      type: ItemTypes.LINK,
      item: { id: link.id, index, catIndex },
      collect: (monitor) => ({ isDragging: monitor.isDragging() }),
    });
    drag(drop(ref));
    return (
      <li ref={ref} className="flex justify-between items-center py-1" style={{ opacity: isDragging ? 0.5 : 1 }}>
        <span className="cursor-move">
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
        <Button variant="destructive" size="sm" onClick={() => deleteLinkMutation.mutate({ categoryId: catId, linkId: link.id })}>Delete</Button>
      </li>
    );
  }

  // If sidebar data changes, update categories state
  useEffect(() => {
    if (sidebar?.categories && !addingLinkCatId && !addingCategory) {
      setCategories(sidebar.categories);
    }
  }, [sidebar, addingLinkCatId, addingCategory]);

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
        {categories.map((cat, idx) => (
          <SidebarCategory key={cat.id} cat={cat} index={idx} />
        ))}
      </div>
    </section>
  );
} 