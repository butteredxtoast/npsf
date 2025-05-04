import { NextRequest, NextResponse } from "next/server";
import { getSidebar, setSidebar } from "@/lib/sidebar";

export async function POST(req: NextRequest) {
  const { categoryId, updates } = await req.json();
  if (!categoryId || !updates) {
    return NextResponse.json({ error: "Missing categoryId or updates" }, { status: 400 });
  }
  const { data, error: getError } = await getSidebar();
  if (getError) return NextResponse.json({ error: getError });
  if (!data) return NextResponse.json({ error: "Sidebar data not found" });
  const catIdx = data.categories.findIndex(c => c.id === categoryId);
  if (catIdx === -1) return NextResponse.json({ error: `Category with ID '${categoryId}' not found` });
  data.categories[catIdx] = { ...data.categories[catIdx], ...updates };
  const { error } = await setSidebar(data);
  return NextResponse.json({ error });
} 