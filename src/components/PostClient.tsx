"use client";
import { useEffect, useState } from "react";
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
  dislikeCount: number;
};

type Comment = {
  _id:string;
body:string;
authorId:{
 name:string;
}
}
export default function PostClient({ post }: { post: Post }) {
  const [likes, setLikes] = useState<number>(post.likeCount || 0);
  const [dislikes, setDislikes] = useState<number>(post.dislikeCount || 0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentInput, setCommentInput] = useState<string>("");
  const [loadingReaction, setLoadingReaction] = useState<"like" | "dislike" | null>(null);

  useEffect(() => {
     getComments();
  },[])

   async function getComments(){
     const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${post._id}/comments`);
     if (res.ok) {
       const data = await res.json();
       console.log(data)
       setComments(data);
     }
   }
  const handleReaction = async (type: "like" | "dislike") => {
    setLoadingReaction(type);
    const toastId = toast.loading(`${type === "like" ? "Liking" : "Disliking"}...`);
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type }),
      });

      toast.dismiss(toastId);

      if (res.ok) {
        const data = await res.json();
        setLikes(data.likeCount);
        setDislikes(data.dislikeCount);
        toast.success(type === "like" ? "👍 Liked!" : "👎 Disliked!");
      } else {
        toast.error("❌ Failed to update reaction");
      }
    } catch (err) {
      toast.dismiss(toastId);
      toast.error("⚠️ Error updating reaction");
    } finally {
      setLoadingReaction(null);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return toast.error("⚠️ Comment cannot be empty");

    const toastId = toast.loading("Adding comment...");
    try {
      const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${post._id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentInput }),
      });
      toast.dismiss(toastId);

      if (res.ok) {
        const newComment = await res.json();
        setComments((prev) => [...prev, newComment]);
        setCommentInput("");
        toast.success("💬 Comment added!");
      } else {
        toast.error("❌ Failed to add comment");
      }
    } catch {
      toast.dismiss(toastId);
      toast.error("⚠️ Error adding comment");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
        {post.coverImageUrl && (
          <img
            src={post.coverImageUrl}
            alt={post.title}
            className="w-full h-64 object-cover"
          />
        )}
        <div className="p-6 space-y-4">
          <h1 className="text-4xl font-bold text-gray-900">{post.title}</h1>
          <div
            className="prose max-w-full text-gray-700"
       
          />
          <div className="flex items-center gap-4 mt-4">
            <button
              disabled={loadingReaction === "like"}
              onClick={() => handleReaction("like")}
              className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-green-100 transition font-semibold disabled:opacity-50"
            >
              👍 {likes}
            </button>
            <button
              disabled={loadingReaction === "dislike"}
              onClick={() => handleReaction("dislike")}
              className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-red-100 transition font-semibold disabled:opacity-50"
            >
              👎 {dislikes}
            </button>
          </div>
        </div>
      </div>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
          Comments
        </h2>

        <ul className="space-y-3">
          {comments.length > 0 ? (
            comments.map((c) => (
              <li
                key={c._id}
                className="bg-gray-50 border rounded-2xl p-4 hover:bg-gray-100 transition"
              >
                <p className="text-gray-800">{c.body}</p>
                <span className="text-xs text-gray-500">
                  {c.authorId.name || "Anonymous"}
                </span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No comments yet.</p>
          )}
        </ul>

        <form onSubmit={handleAddComment} className="flex gap-3 mt-4">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
            className="flex-grow border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-5 py-2 rounded-xl hover:bg-blue-700 transition font-semibold"
          >
            Add
          </button>
        </form>
      </section>
    </div>
  );
}
