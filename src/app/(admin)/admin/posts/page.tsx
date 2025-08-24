"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
type Post = {
  _id: string;
  slug: string;
  title: string;
  excerpt: string;
  likes: number;
  contentHTML:string;
  dislikes: number;
  likeCount:number;
  coverImageUrl: string;
  dislikeCount: string;
};

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/admin/posts`);
    const data = await res.json();
    setPosts(data.posts);
  };

  const deletePost = async (id: string) => {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Post deleted");
      fetchPosts();
    } else toast.error("Failed to delete");
  };

  // const suspendPost = async (id: string, suspended: boolean) => {
  //   const res = await fetch(`/api/posts/${id}`, {
  //     method: "PATCH",
  //     body: JSON.stringify({ suspended: !suspended }),
  //   });
  //   if (res.ok) {
  //     toast.success("Post status updated");
  //     fetchPosts();
  //   } else toast.error("Failed to update");
  // };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Manage Posts</h1>
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Title</th>
            <th className="p-2">Author</th>
            <th className="p-2">Status</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p._id} className="border-t">
              <td className="p-2">{p.title}</td>
              <td className="p-2 space-x-2">
                {/* <Button
                  onClick={() => suspendPost(p.id, p.suspended)}
                  variant={p.suspended ? "default" : "destructive"}
                >
                  {p.suspended ? "Reactivate" : "Suspend"}
                </Button> */}
                <Button onClick={() => deletePost(p._id)} variant="outline">
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
