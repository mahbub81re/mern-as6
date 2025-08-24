import PostClient from "@/components/PostClient";

async function getPost(slug: string) {
  const res = await fetch(`${process.env.NEXTAUTH_URL}/api/posts/${slug}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Failed to fetch post");
  return res.json();
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const id = (await params).slug;
  const post = await getPost(id);

  return <PostClient post={post} />;
}
