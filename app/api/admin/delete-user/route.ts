import { NextRequest, NextResponse } from "next/server";
import { kvDel, kvSrem } from "@/lib/kv";

export async function POST(req: NextRequest) {
  const { email } = await req.json();
  if (!email) {
    return NextResponse.json({ error: "Missing email" }, { status: 400 });
  }
  const emailStr = String(email).toLowerCase();
  const { error: delError } = await kvDel(`user:${emailStr}`);
  const { error: setError } = await kvSrem("users:set", emailStr);
  const error = delError || setError;
  return NextResponse.json({ error });
} 