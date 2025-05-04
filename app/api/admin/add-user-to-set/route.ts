import { NextRequest, NextResponse } from "next/server";
import { kvSadd } from "@/lib/kv";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }
  const emailStr = String(email).toLowerCase();
  const { error } = await kvSadd("users:set", emailStr);
  return NextResponse.json({ error });
} 