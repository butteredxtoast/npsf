"use client";

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignInButton() {
  const { status } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (status === "authenticated") {
      router.push("/dashboard");
    } else {
      signIn("google", { callbackUrl: "/dashboard" });
    }
  };

  return (
    <Button onClick={handleClick}>
      Sign in with Google
    </Button>
  );
} 