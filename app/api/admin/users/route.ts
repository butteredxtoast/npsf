import { NextResponse } from "next/server";
import { kvSmembers } from "@/lib/kv";
import { getUserData } from "@/lib/users";
import type { UserData } from "@/types/user";

export async function GET() {
  const { data: emails, error: setErrorMsg } = await kvSmembers("users:set");
  console.log("Fetched emails from set:", emails);
  let users: UserData[] = [];
  if (!setErrorMsg && emails && emails.length > 0) {
    const flatEmails = emails.flat();
    const userDataList: UserData[] = [];
    for (const email of flatEmails) {
      if (typeof email !== "string") continue;
      const { data, error } = await getUserData(email);
      console.log(`Fetched user for email ${email}:`, data, error);
      if (data) userDataList.push(data);
    }
    users = userDataList;
  }
  return NextResponse.json({ users, error: setErrorMsg });
} 