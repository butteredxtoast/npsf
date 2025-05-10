"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AdminButton() {
    const { data: session } = useSession();
    const isAdmin = session?.user?.accessLevel === "admin";

    if (!isAdmin) return null;

    return (
        <Button asChild>
            <Link href="/admin">Admin Dashboard</Link>
        </Button>
    )
}