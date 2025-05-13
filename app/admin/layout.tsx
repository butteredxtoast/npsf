import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Protect this route: only allow admins
  const session = await auth();
  if (!session?.user?.accessLevel || session.user.accessLevel !== "admin") {
    // Redirect to / with error query param
    redirect("/?error=unauthorized");
  }

  // Only render admin-specific content and tabs here
  return (
    <div className="max-w-4xl mx-auto w-full p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Button asChild variant="outline">
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
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
  );
} 