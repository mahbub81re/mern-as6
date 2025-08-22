"use client";

import { useRouter } from "next/navigation";
import {  useState } from "react";

export default function EditorPage() {
  const [title, setTitle] = useState("");
  const [cover, setCover] = useState("");
  const [content, setContent] = useState("");
  const router = useRouter();



  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch(`/api/posts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title,cover, contentHTML: content }),
    });

    if (res.ok) {
      router.push("/");
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-3 max-w-lg">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="w-full border px-2 py-1"
      />
      <input
        value={cover}
        onChange={(e) => setCover(e.target.value)}
        placeholder="Cover URL"
        className="w-full border px-2 py-1"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content..."
        rows={8}
        className="w-full border px-2 py-1"
      />
      <button type="submit" className="bg-blue-500 text-white px-3 py-1">
        Save
      </button>
    </form>
  );
}
