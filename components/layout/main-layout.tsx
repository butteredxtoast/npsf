import { Header } from "./header";
import DynamicSidebar from "./dynamic-sidebar";
import { auth } from "@/auth";

export async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const isAuthorized = session?.user?.accessLevel === "admin" || session?.user?.accessLevel === "active";

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header isAuthorized={isAuthorized} />
      <div className="flex flex-1">
        {isAuthorized && (
          <DynamicSidebar className="hidden lg:block w-64 border-r" />
        )}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
} 