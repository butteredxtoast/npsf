"use client";

import { useEffect, useState } from "react";
import { getUserData, setUserAccessLevel, addUser } from "@/lib/users";
import { kvSmembers } from "@/lib/kv";
import type { AccessLevel, UserData } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const USER_SET_KEY = "users:set"; // We'll use a Redis set to track all user emails

export default function AdminPage() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newLevel, setNewLevel] = useState<AccessLevel>("active");
  const [adding, setAdding] = useState(false);

  // Fetch all users (by getting all emails from the set, then fetching each user's data)
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    const { data: emails, error: setErrorMsg } = await kvSmembers(USER_SET_KEY);
    if (setErrorMsg) {
      setError(setErrorMsg);
      setLoading(false);
      return;
    }
    if (!emails || emails.length === 0) {
      setUsers([]);
      setLoading(false);
      return;
    }
    const userDataList: UserData[] = [];
    for (const email of emails) {
      const { data } = await getUserData(email);
      if (data) userDataList.push(data);
    }
    setUsers(userDataList);
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
    const { error } = await addUser(newEmail, newLevel);
    if (!error) {
      // Add to the user set for listing
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
    const { error } = await setUserAccessLevel(email, level);
    if (!error) {
      toast.success("Access level updated");
      fetchUsers();
    } else {
      toast.error(error);
    }
  };

  return (
    <section id="users">
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