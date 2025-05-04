import { NextRequest, NextResponse } from "next/server";
import { getSidebar, setSidebar } from "@/lib/sidebar";

export async function POST(req: NextRequest) {
  const { categoryId, linkId, updates } = await req.json();
  if (!categoryId || !linkId || !updates) {
    return NextResponse.json({ error: "Missing categoryId, linkId, or updates" }, { status: 400 });
  }
  const { data, error: getError } = await getSidebar();
  if (getError) return NextResponse.json({ error: getError });
  if (!data) return NextResponse.json({ error: "Sidebar data not found" });
  const catIdx = data.categories.findIndex(c => c.id === categoryId);
  if (catIdx === -1) return NextResponse.json({ error: `Category with ID '${categoryId}' not found` });
  const linkIdx = data.categories[catIdx].links.findIndex(l => l.id === linkId);
  if (linkIdx === -1) return NextResponse.json({ error: `Link with ID '${linkId}' not found in category '${categoryId}'` });
  data.categories[catIdx].links[linkIdx] = { ...data.categories[catIdx].links[linkIdx], ...updates };
  const { error } = await setSidebar(data);
  return NextResponse.json({ error });
} 