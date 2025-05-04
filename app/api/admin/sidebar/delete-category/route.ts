import { NextRequest, NextResponse } from "next/server";
import { deleteCategory } from "@/lib/sidebar";

export async function POST(req: NextRequest) {
  const { categoryId } = await req.json();
  if (!categoryId) {
    return NextResponse.json({ error: "Missing categoryId" }, { status: 400 });
  }
  const { error } = await deleteCategory(categoryId);
  return NextResponse.json({ error });
} 