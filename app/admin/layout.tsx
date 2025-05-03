import { MainLayout } from "@/components/layout/main-layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Protect this route: only allow admins
  const session = await auth();
  if (!session?.user?.accessLevel || session.user.accessLevel !== "admin") {
    redirect("/unauthorized");
  }

  // Determine active tab from URL (optional, for now just show both tabs)
  // You can add tab state with useState/useSearchParams if you want client-side switching

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto w-full p-4">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <Tabs defaultValue="users" className="mb-6">
          <TabsList>
            <TabsTrigger value="users" asChild>
              <Link href="#users">User Management</Link>
            </TabsTrigger>
            <TabsTrigger value="sidebar" asChild>
              <Link href="#sidebar">Sidebar Links Management</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div>{children}</div>
      </div>
    </MainLayout>
  );
} 