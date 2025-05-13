"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SignInButton } from "@/components/auth/sign-in-button";

export default function LandingPage() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/dashboard");
    }
  }, [status, router]);

  if (status === "loading") return null; // or a spinner if you prefer
  if (status === "authenticated") return null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 lg:p-8">
      <h1 className="text-4xl font-bold mb-4">Good Morning!</h1>
      <h2 className="text-2xl mb-8">Y&apos;all Good?</h2>
      <SignInButton />
    </main>
  );
}
