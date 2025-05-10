import { GoogleCalendar } from "@/components/ui/google-calendar";

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 lg:p-8">
      <GoogleCalendar />
    </main>
  );
} 