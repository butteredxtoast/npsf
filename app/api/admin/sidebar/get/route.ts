import { NextResponse } from "next/server";
import { getSidebar } from "@/lib/sidebar";

export async function GET() {
  const { data, error } = await getSidebar();
  return NextResponse.json({ data, error });
} 