import { NextRequest, NextResponse } from "next/server";
import { setSidebar } from "@/lib/sidebar";

export async function POST(req: NextRequest) {
  const { sidebarData } = await req.json();
  if (!sidebarData) {
    return NextResponse.json({ error: "Missing sidebarData" }, { status: 400 });
  }
  const { error } = await setSidebar(sidebarData);
  return NextResponse.json({ error });
} 