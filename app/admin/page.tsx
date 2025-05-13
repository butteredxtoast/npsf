import { getUserData } from "@/lib/users";
import { kvSmembers } from "@/lib/kv";
import type { UserData } from "@/types/user";
import AdminUserManagement from "./user-management-client";
import SidebarManagementClient from "./sidebar-management-client";

export default async function AdminPage() {
  // Fetch all users on the server
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

  return (
    <>
      <AdminUserManagement initialUsers={users} initialError={setErrorMsg} />
      <SidebarManagementClient />
    </>
  );
} 