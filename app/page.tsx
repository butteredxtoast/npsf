// import Image from "next/image"; // Remove unused import
import { GoogleCalendar } from "@/components/ui/google-calendar";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 lg:p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome to the Fitness Group Dashboard</h1>
      <GoogleCalendar />
    </main>
  );
}
