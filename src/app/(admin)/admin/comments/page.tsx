"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
interface Comments {
   _id:string;
   body:string;
   authorEmail:string;
suspended:boolean;
}
export default function AdminCommentsPage() {
  const [comments, setComments] = useState<Comments[]>([]);

  const fetchComments = async () => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/comments`);
    const data = await res.json();
    setComments(data.comments);
  };

  const deleteComment = async (id: string) => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}{process.env.NEXTAUTH_URL}/api/comments/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Comment deleted");
      fetchComments();
    } else toast.error("Failed to delete");
  };

  const suspendComment = async (id: string, suspended: boolean) => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/comments/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ suspended: !suspended }),
    });
    if (res.ok) {
      toast.success("Comment status updated");
      fetchComments();
    } else toast.error("Failed to update");
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Manage Comments</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Comment</th>
            <th className="p-2">Author</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {comments.map((c) => (
            <tr key={c._id} className="border-t">
              <td className="p-2">{c.body}</td>
              <td className="p-2">{c.authorEmail}</td>
              <td className="p-2">{c.suspended ? "Suspended" : "Active"}</td>
              <td className="p-2 space-x-2">
                <Button
                  onClick={() => suspendComment(c._id, c.suspended)}
                  variant={c.suspended ? "default" : "destructive"}
                >
                  {c.suspended ? "Reactivate" : "Suspend"}
                </Button>
                <Button onClick={() => deleteComment(c._id)} variant="outline">
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
