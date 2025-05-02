import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6">Access Denied</h1>
        <div className="mb-8 text-muted-foreground">
          <p className="mb-4">
            You don&#39;t have permission to access this resource. This could be because:
          </p>
          <ul className="list-disc text-left ml-8 mb-4">
            <li>You haven&#39;t been granted access by an administrator</li>
            <li>Your account has been deactivated</li>
            <li>You&#39;re trying to access an admin-only area</li>
          </ul>
          <p>
            If you believe this is an error, please contact the system administrator.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild variant="default">
            <Link href="/">Return to Home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/api/auth/signout">Sign Out</Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 