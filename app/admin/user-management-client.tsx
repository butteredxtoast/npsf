"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import type { AccessLevel, UserData } from "@/types/user";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

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
  const [deleteTarget, setDeleteTarget] = useState<UserData | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  // Delete user
  const handleDeleteUser = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await fetch("/api/admin/delete-user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: deleteTarget.email }),
    });
    const { error } = await res.json();
    if (!error) {
      toast.success("User deleted");
      setDeleteTarget(null);
      fetchUsers();
    } else {
      toast.error(error);
    }
    setDeleting(false);
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
                    <Button
                      variant="outline"
                      size="sm"
                      className="ml-2"
                      onClick={() => setDeleteTarget(user)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {/* Delete confirmation dialog */}
      <Dialog open={!!deleteTarget} onOpenChange={(open: boolean) => !open && setDeleteTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
          </DialogHeader>
          <div>
            Are you sure you want to <span className="text-red-600 font-semibold">permanently delete</span> <span className="font-mono">{deleteTarget?.email}</span>?<br />
            <span className="text-muted-foreground">This action cannot be undone. If you just want to remove access, consider setting their access level to <b>retired</b> using the dropdown instead.</span>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteUser} disabled={deleting}>
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
} 