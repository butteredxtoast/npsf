import { NextResponse } from "next/server";
import { kvSmembers } from "@/lib/kv";
import { getUserData } from "@/lib/users";
import type { UserData } from "@/types/user";

export async function GET() {
  const { data: emails, error: setErrorMsg } = await kvSmembers("users:set");
  let users: UserData[] = [];
  if (!setErrorMsg && emails && emails.length > 0) {
    const flatEmails = emails.flat();
    const userDataList: UserData[] = [];
    for (const email of flatEmails) {
      if (typeof email !== "string") continue;
      const { data } = await getUserData(email);
      if (data) userDataList.push(data);
    }
    users = userDataList;
  }
  return NextResponse.json({ users, error: setErrorMsg });
} 