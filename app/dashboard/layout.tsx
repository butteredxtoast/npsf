import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session || !session.user) {
    redirect("/");
  }
  return <>{children}</>;
} 