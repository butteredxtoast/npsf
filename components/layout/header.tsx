"use client";

import React from "react";
import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sidebar } from "./sidebar"; // Placeholder for mobile sidebar content
import { ModeToggle } from "./mode-toggle"; // Import ModeToggle
import { useSession } from "next-auth/react"; // Import useSession
import { SignInButton } from "../auth/sign-in-button";
import { SignOutButton } from "../auth/sign-out-button";
import { Logo } from "@/components/icons/Logo";
// import { ModeToggle } from "./mode-toggle"; // Will add later

export function Header({ isAuthorized = false }: { isAuthorized?: boolean }) {
  const { data: session, status } = useSession(); // Get session

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Logo className="h-10 w-10 text-foreground" />
          <span className="sr-only">Fitness Group</span>
        </Link>
        {/* Desktop nav items can go here if needed */}
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 md:hidden"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Logo className="h-10 w-10 text-foreground" />
              <span className="sr-only">Fitness Group</span>
            </Link>
            {/* Mobile Sidebar Content - only if authorized */}
            {isAuthorized && <Sidebar className="border-none" />}
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
           <ModeToggle /> {/* Use ModeToggle */}
        </div>
        <div className="ml-auto flex items-center gap-4">
          {status === "loading" ? (
            <div className="h-8 w-20 animate-pulse rounded-md bg-muted"></div> // Placeholder while loading
          ) : session ? (
            <SignOutButton />
          ) : (
            <SignInButton />
          )}
        </div>
        {/* User dropdown can go here - maybe combine with sign out */}
      </div>
    </header>
  );
} 