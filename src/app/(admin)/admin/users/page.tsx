"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";
interface User{
  name:string;
  role:string;
  email:string;
  suspended:boolean;
  _id:string;
}
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");

  const fetchUsers = async () => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/users?q=${query}`);
    const data = await res.json();
    setUsers(data.users);
  };

  const toggleSuspend = async (id: string, suspended: boolean) => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/users/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ suspended: !suspended }),
    });
    if (res.ok) {
      toast.success("User status updated");
      fetchUsers();
    } else toast.error("Failed to update");
  };

  useEffect(() => {
    fetchUsers();
  }, [query]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Manage Users</h1>
      <Input
        placeholder="Search users..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Email</th>
            <th className="p-2">Role</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-2">{u.email}</td>
              <td className="p-2">{u.role}</td>
              <td className="p-2">{u.suspended ? "Suspended" : "Active"}</td>
              <td className="p-2">
                <Button
                  onClick={() => toggleSuspend(u._id, u.suspended)}
                  variant={u.suspended ? "default" : "destructive"}
                >
                  {u.suspended ? "Reactivate" : "Suspend"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
