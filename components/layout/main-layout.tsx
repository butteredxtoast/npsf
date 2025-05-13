import DynamicSidebar from "./dynamic-sidebar";
import { auth } from "@/auth";

export async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAuthorized = session?.user?.accessLevel === "admin" || session?.user?.accessLevel === "active";

  return (
    <>
      {isAuthorized && (
        <DynamicSidebar className="fixed inset-y-0 left-0 z-10 w-64 border-r bg-background hidden lg:flex" />
      )}
      <div className={`flex flex-col min-h-screen ${isAuthorized ? 'lg:ml-64' : ''}`}>
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </>
  );
} 