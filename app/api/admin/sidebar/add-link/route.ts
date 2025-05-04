import { NextRequest, NextResponse } from "next/server";
import { getSidebar, setSidebar } from "@/lib/sidebar";
import type { SidebarLink } from "@/types/sidebar";

export async function POST(req: NextRequest) {
  const { categoryId, link } = await req.json();
  if (!categoryId || !link) {
    return NextResponse.json({ error: "Missing categoryId or link" }, { status: 400 });
  }
  const { data, error: getError } = await getSidebar();
  if (getError) return NextResponse.json({ error: getError });
  if (!data) return NextResponse.json({ error: "Sidebar data not found" });
  const catIdx = data.categories.findIndex(c => c.id === categoryId);
  if (catIdx === -1) return NextResponse.json({ error: `Category with ID '${categoryId}' not found` });
  data.categories[catIdx].links.push(link as SidebarLink);
  const { error } = await setSidebar(data);
  return NextResponse.json({ error });
} 