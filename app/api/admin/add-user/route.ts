import { NextRequest, NextResponse } from "next/server";
import { addUser } from "@/lib/users";

export async function POST(req: NextRequest) {
  const { email, accessLevel } = await req.json();
  if (!email || !accessLevel) {
    return NextResponse.json({ error: "Missing email or accessLevel" }, { status: 400 });
  }
  const { error } = await addUser(email, accessLevel);
  return NextResponse.json({ error });
} 