import { NextRequest, NextResponse } from "next/server";
import { addCategory } from "@/lib/sidebar";

export async function POST(req: NextRequest) {
  const { category } = await req.json();
  if (!category) {
    return NextResponse.json({ error: "Missing category" }, { status: 400 });
  }
  const { error } = await addCategory(category);
  return NextResponse.json({ error });
} 