"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

type Post = {
  _id: string;
  slug: string;
  title: string;
  status:string;
};

export default function UserDashboard() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch(`/api/user/posts`)
      .then((res) => res.json())
      .then(setPosts)
      .catch(() => toast.error("❌ Failed to load posts"));
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Are you sure you want to delete this post?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p._id !== id));
        toast.success("✅ Post deleted successfully");
      } else {
        toast.error("❌ Failed to delete post");
      }
    } catch (error) {
      toast.error("⚠️ Error deleting post");
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === "published" ? "draft" : "published";

    const loadingToast = toast.loading("Updating status...");

    try {
      const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      toast.dismiss(loadingToast);

      if (res.ok) {
        const updatedPost = await res.json();
        setPosts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: updatedPost.status } : p))
        );
        toast.success(
          updatedPost.status === "published"
            ? "✅ Post published"
            : "⚡ Post unpublished"
        );
      } else {
        toast.error("❌ Failed to update post status");
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("⚠️ Error updating post status");
    }
  };

  return (
    <div>
      <h1 className="text-xl font-bold mb-3">My Posts</h1>
      <ul>
        {posts.map((p: Post) => (
          <li key={p._id} className="flex justify-between border-b py-2">
            <span>
              {p.title} ({p.status})
            </span>
            <div className="flex gap-2">
              <Link href={`/user/editor/${p.slug}`}>Edit</Link>
              <button onClick={() => handleDelete(p._id)}>Delete</button>
              <button onClick={() => handleToggleStatus(p._id, p.status)}>
                {p.status === "published" ? "Unpublish" : "Publish"}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
