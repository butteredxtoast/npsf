"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { AccessLevel, UserData } from "@/types/user";

interface AdminUserManagementProps {
  initialUsers: UserData[];
  initialError: string | null;
}

export default function AdminUserManagement({ initialUsers, initialError }: AdminUserManagementProps) {
  const [users, setUsers] = useState<UserData[]>(initialUsers);
  const [error, setError] = useState<string | null>(initialError);
  const [newEmail, setNewEmail] = useState("");
  const [newLevel, setNewLevel] = useState<AccessLevel>("active");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/users");
    const { users, error } = await res.json();
    setUsers(users || []);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Add a new user
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setError(null);
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(newEmail)) {
      setError("Invalid email address");
      setAdding(false);
      return;
    }
    const res = await fetch("/api/admin/add-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: newEmail, accessLevel: newLevel }),
    });
    const { error } = await res.json();
    if (!error) {
      await fetch("/api/admin/add-user-to-set", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail }),
      });
      toast.success("User added successfully");
      setNewEmail("");
      setNewLevel("active");
      fetchUsers();
    } else {
      toast.error(error);
      setError(error);
    }
    setAdding(false);
  };

  // Change access level
  const handleChangeLevel = async (email: string, level: AccessLevel) => {
    const res = await fetch("/api/admin/set-user-access-level", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, accessLevel: level }),
    });
    const { error } = await res.json();
    if (!error) {
      toast.success("Access level updated");
      fetchUsers();
    } else {
      toast.error(error);
    }
  };

  return (
    <section id="users" className="mb-10">
      <h2 className="text-xl font-semibold mb-4">User Management</h2>
      <form onSubmit={handleAddUser} className="flex flex-wrap gap-2 mb-6 items-end">
        <Input
          type="email"
          placeholder="Email address"
          value={newEmail}
          onChange={e => setNewEmail(e.target.value)}
          required
          className="w-64"
        />
        <Select value={newLevel} onValueChange={(v: string) => setNewLevel(v as AccessLevel)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Access Level" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="retired">Retired</SelectItem>
          </SelectContent>
        </Select>
        <Button type="submit" disabled={adding}>
          Add User
        </Button>
      </form>
      <Button variant="outline" className="mb-4" onClick={fetchUsers} disabled={loading}>
        {loading ? "Refreshing..." : "Refresh"}
      </Button>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {loading ? (
        <div>Loading users…</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Access Level</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.email} className="border-b">
                  <td className="p-2 font-mono">{user.email}</td>
                  <td className="p-2">
                    <Select value={user.accessLevel} onValueChange={(v: string) => handleChangeLevel(user.email, v as AccessLevel)}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                  <td className="p-2">
                    {user.accessLevel !== "retired" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleChangeLevel(user.email, "retired")}
                      >
                        Retire
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
} 